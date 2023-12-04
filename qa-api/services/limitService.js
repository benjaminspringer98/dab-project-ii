import { sql } from "../database/database.js";

const hasUserCreatedResourceInLastMinute = async (userUuid) => {
    // don't limit LLM generated answers"
    if (userUuid === "Drunk Bot") {
        return false;
    }

    const now = new Date();

    const lastQuestion = await sql`SELECT * FROM questions WHERE user_uuid = ${userUuid} ORDER BY created_at DESC LIMIT 1`;
    if (lastQuestion.length > 0) {
        const lastQuestionTime = lastQuestion[0].created_at;
        const diffInQuestion = now - lastQuestionTime;
        if (Math.floor(diffInQuestion / 1000) <= 60) {
            return true;
        }
    }

    const lastAnswer = await sql`SELECT * FROM answers WHERE user_uuid = ${userUuid} ORDER BY created_at DESC LIMIT 1`;
    if (lastAnswer.length > 0) {
        const lastAnswerTime = lastAnswer[0].created_at;
        const diffInAnswer = now - lastAnswerTime;
        if (Math.floor(diffInAnswer / 1000) <= 60) {
            return true;
        }
    }

    return false;
}

export {
    hasUserCreatedResourceInLastMinute
}
