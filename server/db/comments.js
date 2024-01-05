const pool = require('./pool');

async function getComments(postId) {
    const commentsQuery = `
        SELECT * FROM comments
        WHERE postId = ?
    `;
    const [result] = await pool.query(commentsQuery, [postId])
    if (result.length > 0) {
        return result;
    } else {
        throw new Error("No comments found");
    }
};

async function addComment(postId, name, email, body) {
    const sql = `
    INSERT INTO comments(postId, name, email, body)
    VALUES (?, ?, ?, ?)
    `;
    const [data] = await pool.query(sql, [postId, name, email, body])
    if (data.affectedRows > 0) {
        return data;
    } else {
        throw new Error('add failed! check the details and try again');
    }
};

async function deleteComment(activeUserId, commentId) {
    const commentDetailsQuery = `
        SELECT comments.postId, posts.userId AS postUserId
        FROM comments
        JOIN posts ON comments.postId = posts.id
        WHERE comments.id = ?
    `;
    const [[commentDetails]] = await pool.query(commentDetailsQuery, [commentId]);
    let postUserId = commentDetails.postUserId;

    if (postUserId !== Number(activeUserId)) {
        throw new Error('You do not have permission to delete this comment');
    }
    const deleteQuery = `
        DELETE FROM comments
        WHERE id = ?
    `;
    const [result] = await pool.query(deleteQuery, [commentId]);
    if (result.affectedRows > 0) {
        return result;
    } else {
        throw new Error("comment not found or not deleted");
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};