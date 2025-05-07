import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikeButton = ({ postId, userId }) => {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch initial like count and status
        axios.get(`http://localhost:8080/api/posts/${postId}/like/count`)
            .then(res => setLikeCount(res.data))
            .catch(console.error);
            
        if (userId) {
            axios.get(`http://localhost:8080/api/posts/${postId}/like/status?userId=${userId}`)
                .then(res => setIsLiked(res.data))
                .catch(console.error);
        }
    }, [postId, userId]);

    const handleLike = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            if (isLiked) {
                await axios.delete(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
                setLikeCount(prev => prev - 1);
            } else {
                await axios.post(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleLike} 
            className={`like-button ${isLiked ? 'text-red-500' : 'text-gray-500'} flex items-center gap-1`}
            disabled={loading || !userId}
        >
            {isLiked ? (
                <span className="text-red-500">❤️</span>
            ) : (
                <span className="text-gray-500">🤍</span>
            )}
            <span>{likeCount}</span>
        </button>
    );
};

export default LikeButton;