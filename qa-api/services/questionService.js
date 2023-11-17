import { sql } from "../database/database.js";

const add = async (courseId, text, userUuid) => {
    await sql`INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (${courseId}, ${text}, ${userUuid}, NOW())`;
}

// sort by most recent activity (question creation or upvote)
const findAllByCourseId = async (courseId) => {
    return await sql`SELECT q.*, GREATEST(q.created_at, COALESCE(latest_upvote, '4713-01-01 00:00:00 BC')) as most_recent_activity
                        FROM questions q
                        LEFT JOIN (
                            SELECT 
                                question_id, 
                                MAX(created_at) as latest_upvote
                            FROM 
                                upvotes
                            GROUP BY 
                                question_id
                        ) u ON q.id = u.question_id
                        WHERE q.course_id = ${courseId}
                        ORDER BY most_recent_activity DESC
                        LIMIT 20`;
}

const getUpvotesCount = async (questionId) => {
    const upvotes = await sql`SELECT COUNT(*) FROM upvotes WHERE question_id = ${questionId}`;
    return upvotes[0].count;
}

const hasUserUpvoted = async (userUuid, questionId) => {
    const upvote = await sql`SELECT COUNT(*) FROM upvotes WHERE question_id = ${questionId} AND user_uuid = ${userUuid}`;
    return upvote[0].count > 0;
}

const toggleUpvote = async (questionId, userUuid) => {
    const upvote = await sql`SELECT * FROM upvotes WHERE question_id = ${questionId} AND user_uuid = ${userUuid}`;
    if (upvote.length > 0) {
        await sql`DELETE FROM upvotes WHERE question_id = ${questionId} AND user_uuid = ${userUuid}`;
        return;
    }

    await sql`INSERT into upvotes (question_id, user_uuid, type, created_at) VALUES (${questionId}, ${userUuid}, 'question', NOW())`;
}

export { add, findAllByCourseId, getUpvotesCount, hasUserUpvoted, toggleUpvote }