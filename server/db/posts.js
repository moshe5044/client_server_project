const pool = require('./pool')

async function getPosts() {
    const postsQuery = `
        SELECT * FROM posts
    `
    const [data] = await pool.query(postsQuery);
    if (data.length > 0) {
        return data;
    } else {
        throw new Error("No posts found");
    }
};

async function getPostsByUser(userId) {
    const sql = `
        SELECT * FROM posts
        WHERE userId = ?
    `;
    const [data] = await pool.query(sql, [userId]);
    if (data.length > 0) {
        return data;
    } else {
        throw new Error("please provide correct user id");
    }
};

async function addPost(userId, title, body) {
    const userCheckQuery = `
        SELECT id 
        FROM users 
        WHERE id = ?;
    `;
    const [userCheck] = await pool.query(userCheckQuery, [userId]);

    if (userCheck.length === 0) {
        throw new Error("User not found. Please provide a valid userId.");
    }

    const sql = `
    INSERT INTO posts(userId, title, body)
    VALUES (?, ?, ?)
`;
    const [result] = await pool.query(sql, [userId, title, body]);
    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("add failed! check the details and try again");
    }
};

async function updatePost(activeUserId, postId, newTitle, newBody) {
    const postDetailsQuery = `
        SELECT userId, title, body
        FROM posts
        WHERE id = ?
    `;

    const [postDetails] = await pool.query(postDetailsQuery, [postId])
    const postUserId = postDetails[0].userId;

    if (postUserId !== Number(activeUserId)) {
        throw new Error('You do not have permission to update this post');
    }
    const sql = `
        UPDATE posts
        SET title = ?, body = ?
        WHERE id = ?
    `;
    const [update] = await pool.query(sql, [newTitle, newBody, postId])
    if (update.affectedRows > 0) {
        return update;
    } else {
        throw new Error("post not found or unchanged");
    }
};

async function deletePost(activeUserId, postId) {
    const postDetailsQuery = `
        SELECT userId, title, body
        FROM posts
        WHERE id = ?
    `;

    const [postDetails] = await pool.query(postDetailsQuery, [postId])
    const postUserId = postDetails[0].userId;
    if (postUserId !== Number(activeUserId)) {
        throw new Error('You do not have permission to delete this post');
    }

    const sql = `
        DELETE FROM posts
        WHERE id = ?
    `;
    console.log(sql);
    const [result] = await pool.query(sql, [postId])
    console.log(result);

    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("post not found or not deleted");
    }
};

module.exports = {
    getPosts,
    getPostsByUser,
    addPost,
    updatePost,
    deletePost
};