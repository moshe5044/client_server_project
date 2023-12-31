const pool = require('./pool');

async function getComments(postId) {
    const getCommentsQuery = `
        SELECT * FROM comments
        WHERE postId = ?
    `;
    const [result] = await pool.query(getCommentsQuery, [postId])
    return result;
};

async function addComment(postId, name, email, body) {
    const sql = `
    INSERT INTO comments(postId, name, email, body)
    VALUES (?, ?, ?, ?)
    `;
    const [data] = await pool.query(sql, [postId, name, email, body])
    return data;
};

async function deleteComment(activeUserId, commentId) {
    const commentDetailsQuery = `
        SELECT comments.postId, posts.userId AS postUserId
        FROM comments
        JOIN posts ON comments.postId = posts.id
        WHERE comments.id = ?
    `;
    const [[commentDetails]] = await pool.query(commentDetailsQuery, [commentId]);
    //let postId = commentDetails.postId;
    let postUserId = commentDetails.postUserId;

    if (postUserId !== activeUserId) {
        throw new Error('You do not have permission to delete this comment');
    }
    const deleteQuery = `
        DELETE FROM comments
        WHERE id = ?
    `;
    const [result] = await pool.query(deleteQuery, [commentId]);
    return result;
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};