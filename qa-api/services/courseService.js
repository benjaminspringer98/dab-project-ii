import { sql } from "../database/database.js";

const findALl = async (request) => {
    return await sql`SELECT * FROM courses`;
}

const findById = async (id) => {
    const rows = await sql`SELECT * FROM courses WHERE id = ${id}`;

    if (rows && rows.length > 0) {
        return rows[0];
    }

    return false;
}

export { findALl, findById }