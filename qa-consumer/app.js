import { connect } from "./deps.js";

const redis = await connect({ hostname: "redis-queue", port: 6379 });
const SERVER_ID = crypto.randomUUID();

async function processQueue() {
  while (true) {
    const serializedData = await redis.sendCommand("BRPOP", ["questions_queue", 10]);

    if (serializedData) {
      const data = JSON.parse(serializedData[1]);

      console.log(`SERVER ${SERVER_ID} calling LLM API with data: ${data.questionText}`);

      const llmResponse = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: data.questionText }),
      });

      const llmResponseData = await llmResponse.json();
      console.log("llmResponseData: ", llmResponseData);

    } else {
      console.log("No data in queue, waiting...");
    }
  }
}

processQueue();

