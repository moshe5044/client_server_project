const pool = require("./pool");

async function getTodos(id) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
    `;
    const [data] = await pool.query(todosQuery, [id]);
    return data;
};

async function getCompletedTodos(id) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
        AND completed = 1
    `;
    const [data] = await pool.query(todosQuery, [id])
    return data;
};

async function getUnCompletedTodos(id) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
        AND completed = 0
    `;
    const [data] = await pool.query(todosQuery, [id])
    return data;
};

async function addTodo(userId, title) {
    const insertQuery = `
        INSERT INTO todos(userId, title, completed)
        VALUES (?, ?, 0)
    `;
    const [result] = await pool.query(insertQuery, [userId, title]);
    return result;
};

async function updateTitle(id, title) {
    const sql = `
        UPDATE todos
        SET title = ?
        WHERE id = ?
    `
    const update = await pool.query(sql, [title, id])
    return update;
};

async function updateCompleted(id) {
    const sql = `
        UPDATE todos
        SET completed = CASE
            WHEN completed = 1 THEN 0
            ELSE 1
        END
        WHERE id = ?
    `
    const result = await pool.query(sql, [id])
    return result;
};

async function deleteTodo(id) {
    const deleteQuery = `
        DELETE FROM todos
        WHERE id = ?
    `
    const result = await pool.query(deleteQuery, [id])
    return result;
};

module.exports = {
    getTodos,
    getCompletedTodos,
    getUnCompletedTodos,
    addTodo,
    updateTitle,
    updateCompleted,
    deleteTodo
};