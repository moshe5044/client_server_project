const pool = require("./pool");

async function getTodos(userId) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
    `;
    const [data] = await pool.query(todosQuery, [userId]);
    if (data.length > 0) {
        return data;
    } else {
        throw new Error("User does not exist");
    }
};

async function getCompletedTodos(userId) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
        AND completed = 1
    `;
    const [data] = await pool.query(todosQuery, [userId])
    if (data.length > 0) {
        return data;
    } else {
        throw new Error("please provide the correct user id");
    }
};

async function getUnCompletedTodos(userId) {
    const todosQuery = `
        SELECT * FROM todos
        WHERE userId = ?
        AND completed = 0
    `;
    const [data] = await pool.query(todosQuery, [userId])
    if (data.length > 0) {
        return data;
    } else {
        throw new Error("please provide the correct user id");
    }
};

async function addTodo(userId, title) {
    const insertQuery = `
        INSERT INTO todos(userId, title, completed)
        VALUES (?, ?, 0)
    `;
    const [result] = await pool.query(insertQuery, [userId, title]);
    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("add failed! check the details and try again");
    }
};

async function updateTitle(userId, todoId, title) {
    const ownerCheckQuery = `
        SELECT userId 
        FROM todos 
        WHERE id = ?;
    `;
    const [ownerCheckResult] = await pool.query(ownerCheckQuery, [todoId]);
    if (ownerCheckResult.length === 0 || ownerCheckResult[0].userId !== userId) {
        throw new Error("You do not have permission to update this todo");
    }
    const sql = `
        UPDATE todos
        SET title = ?
        WHERE id = ?
    `
    const [update] = await pool.query(sql, [title, todoId])
    if (update.affectedRows > 0) {
        return update;
    } else {
        throw new Error("Todo not found or title unchanged");
    }
};

async function updateCompleted(userId, todoId) {
    const ownerCheckQuery = `
        SELECT userId 
        FROM todos 
        WHERE id = ?;
    `;
    const [ownerCheckResult] = await pool.query(ownerCheckQuery, [todoId]);
    if (ownerCheckResult[0].userId !== Number(userId)) {
        throw new Error("You do not have permission to update this todo");
    }
    
    const sql = `
        UPDATE todos
        SET completed = CASE
            WHEN completed = 1 THEN 0
            ELSE 1
        END
        WHERE id = ?
    `
    const [result] = await pool.query(sql, [todoId])
    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("Todo not found or completed unchanged")
    }
};

async function deleteTodo(userId, todoId) {
    const ownerCheckQuery = `
        SELECT userId 
        FROM todos 
        WHERE id = ?;
    `;
    const [ownerCheckResult] = await pool.query(ownerCheckQuery, [todoId]);
    if (ownerCheckResult[0].userId !== userId) {
        throw new Error("You do not have permission to delete this todo");
    }
    const deleteQuery = `
        DELETE FROM todos
        WHERE id = ?
    `
    const [result] = await pool.query(deleteQuery, [todoId])
    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("Todo not found or not deleted");
    }
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