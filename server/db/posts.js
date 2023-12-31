const pool = require('./pool')

async function getPosts() {
    const postsQuery = `
        SELECT * FROM posts
    `
    const [data] = await pool.query(postsQuery);
    return data;
};

async function getPostsByUser(userId) {
    const sql = `
        SELECT * FROM posts
        where userId = ?
    `;
    const [data] = await pool.query(sql, [userId]);
    return data;
};

async function addPost(userId, title, body) {
    const sql = `
    INSERT INTO posts(userId, title, body)
    VALUES (?, ?, ?)
`;
    const result = await pool.query(sql, [userId, title, body]);
    return result;
};

async function updatepost(activeUserId, id, newTitle, newBody) {
    const postDetailsQuery = `
        SELECT userId, title, body
        FROM posts
        WHERE id = ?
    `;

    const [postDetails] = await pool.query(postDetailsQuery, [id])
    const postUserId = postDetails[0].userId;

    if (postUserId !== activeUserId) {
        throw new Error('You do not have permission to update this post');
    }
    const sql = `
        UPDATE posts
        SET title = ?, body = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(sql, [newTitle, newBody, id])
    return result;
};

async function deletePost(activeUserId, id) {
    const postDetailsQuery = `
        SELECT userId, title, body
        FROM posts
        WHERE id = ?
    `;

    const [postDetails] = await pool.query(postDetailsQuery, [id])
    const postUserId = postDetails[0].userId;

    if (postUserId !== activeUserId) {
        throw new Error('You do not have permission to delete this post');
    }
    const sql = `
        DELETE FROM posts
        WHERE id = ?
    `;
    const [result] = await pool.query(sql, [id])
    return result;
};

module.exports = {
    getPosts,
    getPostsByUser,
    addPost,
    updatepost,
    deletePost
};