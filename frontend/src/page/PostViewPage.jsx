import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import LikeButton from "../components/LikeButton.jsx";

const PostViewPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({}); // New state for comment counts
  const [userId] = useState(1); // Replace with actual user ID from auth
  const navigate = useNavigate();

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/post/view");
      setPosts(response.data);
      
      // Initialize comment counts for each post
      const counts = {};
      response.data.forEach(post => {
        counts[post.id] = post.commentCount || 0;
      });
      setCommentCounts(counts);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
      setActiveComments(prev => ({ ...prev, [postId]: response.data }));
      // Update comment count when fetching comments
      setCommentCounts(prev => ({ ...prev, [postId]: response.data.length }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Like/Unlike a post
  const handleLike = async (postId) => {
    try {
      const hasLiked = await axios.get(`http://localhost:8080/api/posts/${postId}/like/status?userId=${userId}`);
      
      if (hasLiked.data) {
        await axios.delete(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
      } else {
        await axios.post(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
      }
      
      // Refresh the post to update like count
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Add a new comment
  const handleAddComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;
    
    try {
      await axios.post(`http://localhost:8080/api/posts/${postId}/comments`, null, {
        params: {
          userId,
          content: newComments[postId]
        }
      });
      
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      // Increment comment count
      setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Update a comment
  const handleUpdateComment = async (postId, commentId) => {
    if (!editingComments[commentId]?.content?.trim()) return;
    
    try {
      await axios.put(`http://localhost:8080/api/posts/commentsupdate/${commentId}`, null, {
        params: {
          content: editingComments[commentId].content
        }
      });
      
      setEditingComments(prev => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
      fetchComments(postId);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/commentsdelete/${commentId}`);
        fetchComments(postId);
        // Decrement comment count
        setCommentCounts(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  // Toggle comments visibility for a post
  const toggleComments = (postId) => {
    if (activeComments[postId]) {
      setActiveComments(prev => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
    } else {
      fetchComments(postId);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:8080/api/post/delete/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/post-update/${postId}`);
  };

  return (
    <div style={styles.pageWrapper}>
      <Header />
      <div style={styles.description}>
        <h2 style={styles.descriptionTitle}>Welcome to the Post View Page</h2>
        <p style={styles.descriptionText}>
          Explore posts from instructors and students. Enroll in courses, follow
          creators, and engage with content!
        </p>
      </div>
      {loading ? (
        <p style={styles.loadingText}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={styles.noPostsText}>No posts available.</p>
      ) : (
        <div style={styles.postContainer}>
          {posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postDescription}>{post.description}</p>
              
              {/* Media display */}
              <div style={styles.mediaContainer}>
                {post.image1 && (
                  <div style={styles.mediaWrapper}>
                    <img
                      src={`http://localhost:8080/uploads/${post.image1}`}
                      alt="Image 1"
                      style={styles.media}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/200?text=Image+Not+Found")
                      }
                    />
                  </div>
                )}
                {/* Other images and video... */}
              </div>

              {/* Like section */}
              <div style={styles.interactionSection}>
              
                <LikeButton 
                  postId={post.id.toString()} 
                  userId={userId} 
                />
                
                <button 
                  onClick={() => toggleComments(post.id)}
                  style={styles.commentToggleButton}
                >
                  💬 Comments ({commentCounts[post.id] || 0}) {/* Use commentCounts state */}
                </button>
              </div>

              {/* Comments section */}
              {activeComments[post.id] && (
                <div style={styles.commentsSection}>
                  <div style={styles.commentList}>
                    {activeComments[post.id].map(comment => (
                      <div key={comment.id} style={styles.commentItem}>
                        {editingComments[comment.id] ? (
                          <div style={styles.commentEditForm}>
                            <textarea
                              value={editingComments[comment.id].content}
                              onChange={(e) => setEditingComments(prev => ({
                                ...prev,
                                [comment.id]: {
                                  ...prev[comment.id],
                                  content: e.target.value
                                }
                              }))}
                              style={styles.commentEditInput}
                            />
                            <div style={styles.commentEditActions}>
                              <button 
                                onClick={() => handleUpdateComment(post.id, comment.id)}
                                style={styles.saveButton}
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingComments(prev => {
                                  const newState = { ...prev };
                                  delete newState[comment.id];
                                  return newState;
                                })}
                                style={styles.cancelButton}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={styles.commentContent}>{comment.content}</p>
                            <div style={styles.commentMeta}>
                              <span>By User {comment.userId}</span>
                              <span>{new Date(comment.createdAt).toLocaleString()}</span>
                              {comment.userId === userId && (
                                <div style={styles.commentActions}>
                                  <button 
                                    onClick={() => setEditingComments(prev => ({
                                      ...prev,
                                      [comment.id]: {
                                        postId: post.id,
                                        content: comment.content
                                      }
                                    }))}
                                    style={styles.editButton}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                    style={styles.deleteCommentButton}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Add new comment */}
                  <div style={styles.addCommentSection}>
                    <textarea
                      value={newComments[post.id] || ''}
                      onChange={(e) => setNewComments(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))}
                      placeholder="Write a comment..."
                      style={styles.commentInput}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComments[post.id]?.trim()}
                      style={styles.addCommentButton}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              )}

              {/* Post actions */}
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleUpdatePost(post.id)}
                  style={styles.updateButton}
                >
                  Update Post
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={styles.deleteButton}
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// // Enhanced styles
// const styles = {
//   // ... (keep your existing styles)
//   pageWrapper: {
//     minHeight: "100vh",
//     backgroundColor: "#f4f6f8",
//   },
//   description: {
//     textAlign: "center",
//     padding: "30px 20px",
//     backgroundColor: "#fff",
//     borderBottom: "1px solid #ddd",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
//   },
//   descriptionTitle: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: "10px",
//   },
//   descriptionText: {
//     fontSize: "16px",
//     color: "#666",
//     maxWidth: "600px",
//     margin: "0 auto",
//   },
//   loadingText: {
//     textAlign: "center",
//     fontSize: "18px",
//     color: "#666",
//     padding: "20px",
//   },
//   noPostsText: {
//     textAlign: "center",
//     fontSize: "18px",
//     color: "#666",
//     padding: "20px",
//   },
//   postContainer: {
//     maxWidth: "900px",
//     margin: "30px auto",
//     padding: "0 20px",
//   },
//   postCard: {
//     border: "1px solid #ddd",
//     borderRadius: "12px",
//     padding: "20px",
//     marginBottom: "25px",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     overflow: "hidden",
//   },
//   postTitle: {
//     fontSize: "22px",
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: "10px",
//   },
//   postDescription: {
//     fontSize: "16px",
//     color: "#555",
//     lineHeight: "1.5",
//     marginBottom: "15px",
//   },
//   mediaContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "15px",
//     margin: "15px 0",
//     justifyContent: "flex-start",
//     maxWidth: "100%",
//   },
//   mediaWrapper: {
//     flex: "1 1 200px",
//     maxWidth: "200px",
//     maxHeight: "200px",
//     borderRadius: "8px",
//     overflow: "hidden",
//     boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   },
//   media: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     display: "block",
//   },
//   courseLinkWrapper: {
//     marginTop: "10px",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//     fontSize: "16px",
//     fontWeight: "500",
//   },
//   userInfo: {
//     fontSize: "14px",
//     color: "#666",
//     marginTop: "15px",
//     fontStyle: "italic",
//   },
//   buttonContainer: {
//     marginTop: "20px",
//     display: "flex",
//     gap: "15px",
//     justifyContent: "flex-end",
//   },
//   updateButton: {
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "background-color 0.3s, transform 0.2s",
//   },
//   deleteButton: {
//     padding: "10px 20px",
//     backgroundColor: "#dc3545",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "background-color 0.3s, transform 0.2s",
//   },

//   interactionSection: {
//     display: 'flex',
//     gap: '15px',
//     margin: '15px 0',
//     alignItems: 'center'
//   },
  
//   likeButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '18px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px'
//   },
  
//   likeCount: {
//     fontSize: '14px'
//   },
  
//   commentToggleButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '14px',
//     color: '#555'
//   },
  
//   commentsSection: {
//     marginTop: '15px',
//     borderTop: '1px solid #eee',
//     paddingTop: '15px'
//   },
  
//   commentList: {
//     marginBottom: '15px',
//     maxHeight: '300px',
//     overflowY: 'auto'
//   },
  
//   commentItem: {
//     padding: '10px',
//     marginBottom: '10px',
//     backgroundColor: '#f9f9f9',
//     borderRadius: '5px'
//   },
  
//   commentContent: {
//     margin: '0 0 5px 0'
//   },
  
//   commentMeta: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     fontSize: '12px',
//     color: '#666'
//   },
  
//   commentActions: {
//     display: 'flex',
//     gap: '10px'
//   },
  
//   editButton: {
//     background: 'none',
//     border: 'none',
//     color: '#007bff',
//     cursor: 'pointer',
//     fontSize: '12px'
//   },
  
//   deleteCommentButton: {
//     background: 'none',
//     border: 'none',
//     color: '#dc3545',
//     cursor: 'pointer',
//     fontSize: '12px'
//   },
  
//   commentEditForm: {
//     marginBottom: '10px'
//   },
  
//   commentEditInput: {
//     width: '100%',
//     minHeight: '60px',
//     padding: '8px',
//     marginBottom: '5px',
//     border: '1px solid #ddd',
//     borderRadius: '4px'
//   },
  
//   commentEditActions: {
//     display: 'flex',
//     gap: '10px'
//   },
  
//   saveButton: {
//     padding: '5px 10px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
  
//   cancelButton: {
//     padding: '5px 10px',
//     backgroundColor: '#6c757d',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
  
//   addCommentSection: {
//     marginTop: '15px'
//   },
  
//   commentInput: {
//     width: '100%',
//     minHeight: '60px',
//     padding: '8px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     marginBottom: '10px'
//   },
  
//   addCommentButton: {
//     padding: '8px 15px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
    
//     '&:disabled': {
//       backgroundColor: '#cccccc',
//       cursor: 'not-allowed'
//     }
//   }
// };

const styles = {
  pageWrapper: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    paddingBottom: '50px',
  },
  description: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px 20px',
    textAlign: 'center',
    color: '#333',
  },
  descriptionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  descriptionText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#7f8c8d',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
    marginTop: '50px',
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
    marginTop: '50px',
  },
  postContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    marginBottom: '30px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  postTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#2c3e50',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  postDescription: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#34495e',
    marginBottom: '20px',
  },
  mediaContainer: {
    margin: '20px 0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  mediaWrapper: {
    flex: '1 1 300px',
    maxHeight: '400px',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  interactionSection: {
    display: 'flex',
    gap: '20px',
    margin: '20px 0',
    alignItems: 'center',
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 15px',
    borderRadius: '20px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
  },
  likeCount: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
  },
  commentToggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#555',
    padding: '8px 15px',
    borderRadius: '20px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
  },
  commentsSection: {
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
  },
  commentList: {
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  commentItem: {
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f1f3f5',
    },
  },
  commentContent: {
    margin: '0 0 10px 0',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#333',
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#7f8c8d',
  },
  commentActions: {
    display: 'flex',
    gap: '15px',
  },
  editButton: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#2980b9',
    },
  },
  deleteCommentButton: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#c0392b',
    },
  },
  commentEditForm: {
    marginBottom: '10px',
  },
  commentEditInput: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    lineHeight: '1.5',
    resize: 'vertical',
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
    },
  },
  commentEditActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#7f8c8d',
    },
  },
  addCommentSection: {
    marginTop: '20px',
  },
  commentInput: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '15px',
    lineHeight: '1.5',
    resize: 'vertical',
    transition: 'all 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
    },
    '&::placeholder': {
      color: '#bdc3c7',
    },
  },
  addCommentButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  updateButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
};
export default PostViewPage;