import { sql } from "../database/database.js";

const add = async (courseId, title, text, userUuid) => {
    const created = await sql`INSERT INTO questions (course_id, title, text, user_uuid, created_at) 
                VALUES (${courseId}, ${title}, ${text}, ${userUuid}, NOW())
                RETURNING id`;

    return created[0].id;
}

const findById = async (id) => {
    const rows = await sql`SELECT * FROM questions WHERE id = ${id}`;

    if (rows && rows.length > 0) {
        return rows[0];
    }

    return false;
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

const findAllByCourseIdPaginated = async (courseId, pageNumber) => {
    const questionsPerPage = 20;
    const offset = (pageNumber - 1) * questionsPerPage;

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
                        LIMIT ${questionsPerPage} OFFSET ${offset}`;
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

const hasUserCreatedInLastMinute = async (userUuid) => {
    const lastQuestion = await sql`SELECT * FROM questions WHERE user_uuid = ${userUuid} ORDER BY created_at DESC LIMIT 1`;

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

export { add, findById, findAllByCourseId, findAllByCourseIdPaginated, getUpvotesCount, hasUserUpvoted, toggleUpvote, hasUserCreatedInLastMinute }