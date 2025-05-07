import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ postId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !userId) return;

        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/comments`, null, {
                params: {
                    userId,
                    content: newComment
                }
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleUpdate = async (commentId) => {
        if (!editCommentText.trim()) return;
        
        try {
            await axios.put(`http://localhost:8080/api/posts/commentsupdate/${commentId}`, null, {
                params: {
                    content: editCommentText
                }
            });
            setEditingCommentId(null);
            setEditCommentText('');
            fetchComments();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/commentsdelete/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditCommentText('');
    };

    return (
        <div className="comment-section mt-4">
            <h3 className="text-lg font-semibold mb-2">Comments ({comments.length})</h3>
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                <ul className="space-y-3">
                    {comments.map(comment => (
                        <li key={comment.id} className="border-b pb-2">
                            {editingCommentId === comment.id ? (
                                <div className="mb-2">
                                    <textarea
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => handleUpdate(comment.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEditing}
                                            className="bg-gray-500 text-white px-3 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-800">{comment.content}</p>
                                    <small className="text-gray-500 flex items-center gap-2">
                                        By: User {comment.userId} • 
                                        {new Date(comment.createdAt).toLocaleString()}
                                        {comment.userId === userId && (
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => startEditing(comment)}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </small>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {userId && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        disabled={!newComment.trim()}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Post Comment
                    </button>
                </form>
            )}
        </div>
    );


};


export default CommentSection;