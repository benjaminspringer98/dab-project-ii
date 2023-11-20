import { connect } from "./deps.js";

const redis = await connect({ hostname: "redis-queue", port: 6379 });
const SERVER_ID = crypto.randomUUID();
const name = "Drunk Bot";

async function processQueue() {
  while (true) {
    const serializedData = await redis.sendCommand("BRPOP", ["questions_queue", 10]);

    if (serializedData) {
      const data = JSON.parse(serializedData[1]);

      // generate 3 answers for each question
      for (let i = 0; i < 3; i++) {

        // fetch question text from qa-api, instead of storing complete text in queue
        const questionRes = await fetch(`http://qa-api:7777/courses/${data.courseId}/questions/${data.questionId}`)
        const question = await questionRes.json();

        // call LLM API to generate answer
        console.log(`SERVER ${SERVER_ID} calling LLM API with question text: ${question.text}`);
        const llmResponse = await fetch("http://llm-api:7000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: question.text }),
        });

        const llmResponseData = await llmResponse.json();
        console.log("llmResponseData: ", llmResponseData);

        // post answer to qa-api
        await fetch(`http://qa-api:7777/courses/${data.courseId}/questions/${data.questionId}/answers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: llmResponseData[0].generated_text, userUuid: name }),
        });
      }
    } else {
      console.log("No data in queue, waiting...");
    }
  }
}

processQueue();

