import { sql } from "../database/database.js";

const add = async (questionId, text, userUuid) => {
    await sql`INSERT INTO answers (question_id, text, user_uuid, created_at) VALUES (${questionId}, ${text}, ${userUuid}, NOW())`;
}

// sort by most recent activity (answer creation or upvote)
const findAllByQuestionId = async (questionId) => {
    return await sql`SELECT a.*, GREATEST(a.created_at, COALESCE(latest_upvote, '4713-01-01 00:00:00 BC')) as most_recent_activity
                        FROM answers a
                        LEFT JOIN (
                            SELECT 
                                answer_id, 
                                MAX(created_at) as latest_upvote
                            FROM 
                                upvotes
                            GROUP BY 
                                answer_id
                        ) u ON a.id = u.answer_id
                        WHERE a.question_id = ${questionId}
                        ORDER BY most_recent_activity DESC
                        LIMIT 20`;
}

const getUpvotesCount = async (answerId) => {
    const upvotes = await sql`SELECT COUNT(*) FROM upvotes WHERE answer_id = ${answerId}`;
    return upvotes[0].count;
}

const hasUserUpvoted = async (userUuid, answerId) => {
    const upvote = await sql`SELECT COUNT(*) FROM upvotes WHERE answer_id = ${answerId} AND user_uuid = ${userUuid}`;
    return upvote[0].count > 0;
}

const toggleUpvote = async (answerId, userUuid) => {
    const upvote = await sql`SELECT * FROM upvotes WHERE answer_id = ${answerId} AND user_uuid = ${userUuid}`;
    if (upvote.length > 0) {
        await sql`DELETE FROM upvotes WHERE answer_id = ${answerId} AND user_uuid = ${userUuid}`;
        return;
    }

    await sql`INSERT into upvotes (answer_id, user_uuid, type, created_at) VALUES (${answerId}, ${userUuid}, 'answer', NOW())`;
}

const hasUserCreatedInLastMinute = async (userUuid) => {
    // don't limit LLM generated answers
    if (userUuid === "Drunk Bot") {
        return false;
    }

    const lastQuestion = await sql`SELECT * FROM answers WHERE user_uuid = ${userUuid} ORDER BY created_at DESC LIMIT 1`;

    if (lastQuestion.length > 0) {
        const lastQuestionTime = lastQuestion[0].created_at;
        const now = new Date();
        const diff = now - lastQuestionTime;
        const seconds = Math.floor(diff / 1000);
        console.log("seconds: " + seconds);
        return seconds <= 60;
    }

    return false;
}

export { add, findAllByQuestionId, getUpvotesCount, hasUserUpvoted, toggleUpvote, hasUserCreatedInLastMinute }