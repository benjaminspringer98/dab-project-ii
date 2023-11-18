import { serve } from "./deps.js";
import * as courseService from "./services/courseService.js";
import * as questionService from "./services/questionService.js";
import * as answerService from "./services/answerService.js";

const getCourses = async (request) => {
  const courses = await courseService.findALl();
  return new Response(JSON.stringify(courses));
}

const getCourse = async (request, urlPatternResult) => {
  const courseId = urlPatternResult.pathname.groups.cId;

  const course = await courseService.findById(courseId);
  return new Response(JSON.stringify(course));
}

const addQuestion = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const courseId = urlPatternResuls.pathname.groups.cId;

  try {
    await questionService.add(courseId, requestData.text, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }

  return new Response({ status: 200 })
}

const getQuestions = async (request, urlPatternResuls) => {
  const courseId = urlPatternResuls.pathname.groups.cId;

  const questions = await questionService.findAllByCourseId(courseId);
  return new Response(JSON.stringify(questions));
}

const getQuestion = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.qId;

  const question = await questionService.findById(questionId);
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

  const answers = await answerService.findAllByQuestionId(questionId);
  return new Response(JSON.stringify(answers));
}

const addAnswer = async (request, urlPatternResuls) => {
  const requestData = await request.json();
  const questionId = urlPatternResuls.pathname.groups.qId;

  try {
    await answerService.add(questionId, requestData.text, requestData.userUuid);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
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
