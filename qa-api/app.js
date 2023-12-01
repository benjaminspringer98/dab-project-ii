import { serve, connect } from "./deps.js";
import * as courseService from "./services/courseService.js";
import * as questionService from "./services/questionService.js";
import * as answerService from "./services/answerService.js";
import { cacheMethodCalls } from "./utils/cacheUtils.js";

const redis = await connect({ hostname: "redis-queue", port: 6379 });

const cachedCourseService = cacheMethodCalls(courseService, "courseService", [""]);
const cachedQuestionService = cacheMethodCalls(questionService, "questionService", [""]);

const courseRooms = new Map(); // Map for course WebSockets
const questionRooms = new Map(); // Map for question WebSockets

const getCourses = async (request) => {
  const courses = await cachedCourseService.findAll();
  return new Response(JSON.stringify(courses));
}

const getCourse = async (request, urlPatternResult) => {
  const courseId = urlPatternResult.pathname.groups.cId;

  const course = await cachedCourseService.findById(courseId);

  if (!course) {
    return new Response(JSON.stringify({ status: 404 }))
  }

  return new Response(JSON.stringify(course));
}

const addQuestion = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const courseId = urlPatternResuls.pathname.groups.cId;

  if (!requestData.title || !requestData.text) {
    return new Response("Missing title or text", { status: 400 })
  }

  // allow one question per minute per user
  const hasUserCreatedInLastMinute = await questionService.hasUserCreatedInLastMinute(requestData.userUuid)
  if (hasUserCreatedInLastMinute) {
    return new Response("Too many requests", { status: 429 })
  }

  let questionId;
  try {
    questionId = await questionService.add(courseId, requestData.title, requestData.text, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response({ status: 500 })
  }

  if (!questionId) {
    return new Response({ status: 500 })
  }

  // dont push question text into queue, instead push question id
  const data = {
    courseId: courseId,
    questionId: questionId,
  };

  const question = await cachedQuestionService.findById(questionId);
  // send question to all sockets in room with corresponding courseId
  if (courseRooms.has(courseId)) {
    courseRooms.get(courseId).forEach(socket => {
      socket.send(JSON.stringify(question));
    });
  }

  // push into queue for async generation of llm answers
  await redis.lpush("questions_queue", JSON.stringify(data));

  return new Response({ status: 200 })
}

const getQuestions = async (request, urlPatternResuls) => {
  const courseId = urlPatternResuls.pathname.groups.cId;

  const url = new URL(request.url);
  const params = url.searchParams;
  const pageNumber = params.get("page");

  const questions = await questionService.findAllByCourseIdPaginated(courseId, pageNumber);
  return new Response(JSON.stringify(questions));
}

const getQuestion = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.qId;

  const question = await cachedQuestionService.findById(questionId);

  if (!question) {
    return new Response(JSON.stringify({ status: 404 }))
  }

  return new Response(JSON.stringify(question));
}

const toggleQuestionUpvote = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const questionId = urlPatternResuls.pathname.groups.qId;

  try {
    await questionService.toggleUpvote(questionId, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }

  return new Response({ status: 200 })
}

// returns number of question upvotes and whether current user has upvoted
const fetchQuestionUpvoteData = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const questionId = urlPatternResuls.pathname.groups.qId;

  const count = await questionService.getUpvotesCount(questionId);
  const hasUserUpvoted = await questionService.hasUserUpvoted(requestData.userUuid, questionId);
  return new Response(JSON.stringify({ count, hasUserUpvoted }));
}

const getAnswers = async (request, urlPatternResuls) => {
  const questionId = urlPatternResuls.pathname.groups.qId;

  const url = new URL(request.url);
  const params = url.searchParams;
  const pageNumber = params.get("page");

  const answers = await answerService.findAllByQuestionIdPaginated(questionId, pageNumber);

  return new Response(JSON.stringify(answers));
}

const addAnswer = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const questionId = urlPatternResuls.pathname.groups.qId;

  // allow one answer per minute per user
  const hasUserCreatedInLastMinute = await answerService.hasUserCreatedInLastMinute(requestData.userUuid)
  if (hasUserCreatedInLastMinute) {
    return new Response("Too many requests", { status: 429 })
  }

  let answerId;
  try {
    answerId = await answerService.add(questionId, requestData.text, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }

  if (!answerId) {
    return new Response({ status: 500 })
  }

  const answer = await answerService.findById(answerId);

  // send answer to all sockets in room with corresponding questionId
  if (questionRooms.has(questionId)) {
    questionRooms.get(questionId).forEach(socket => {
      socket.send(JSON.stringify(answer));
    });
  }

  return new Response({ status: 200 })
}

const toggleAnswerUpvote = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const answerId = urlPatternResuls.pathname.groups.aId;

  try {
    await answerService.toggleUpvote(answerId, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }

  return new Response({ status: 200 })
}

// returns number of question upvotes and whether current user has upvoted
const fetchAnswerUpvoteData = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const answerId = urlPatternResuls.pathname.groups.aId;

  const count = await answerService.getUpvotesCount(answerId);
  const hasUserUpvoted = await answerService.hasUserUpvoted(requestData.userUuid, answerId);
  return new Response(JSON.stringify({ count, hasUserUpvoted }));
}

const connectToCourseRoom = async (request, urlPatternResuls) => {
  const { socket, response } = Deno.upgradeWebSocket(request);

  const courseId = urlPatternResuls.pathname.groups.cId;

  if (!courseRooms.has(courseId)) {
    courseRooms.set(courseId, new Set());
  }
  courseRooms.get(courseId).add(socket);

  socket.onclose = () => {
    courseRooms.get(courseId).delete(socket);
    if (courseRooms.get(courseId).size === 0) {
      courseRooms.delete(courseId);
    }
  };

  return response;
}

const connectToQuestionRoom = async (request, urlPatternResuls) => {
  const { socket, response } = Deno.upgradeWebSocket(request);

  const questionId = urlPatternResuls.pathname.groups.qId;

  if (!questionRooms.has(questionId)) {
    questionRooms.set(questionId, new Set());
  }
  questionRooms.get(questionId).add(socket);

  socket.onclose = () => {
    questionRooms.get(questionId).delete(socket);
    if (questionRooms.get(questionId).size === 0) {
      questionRooms.delete(questionId);
    }
  };

  return response;
}

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses" }),
    fn: getCourses,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses/:cId" }),
    fn: getCourse,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions" }),
    fn: addQuestion,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions" }),
    fn: getQuestions,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId" }),
    fn: getQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/toggleUpvote" }),
    fn: toggleQuestionUpvote,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/upvotes" }),
    fn: fetchQuestionUpvoteData,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/answers" }),
    fn: getAnswers,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/answers" }),
    fn: addAnswer,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/answers/:aId/toggleUpvote" }),
    fn: toggleAnswerUpvote,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:cId/questions/:qId/answers/:aId/upvotes" }),
    fn: fetchAnswerUpvoteData,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/ws/courses/:cId" }),
    fn: connectToCourseRoom,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/ws/questions/:qId" }),
    fn: connectToQuestionRoom,
  },
]

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
