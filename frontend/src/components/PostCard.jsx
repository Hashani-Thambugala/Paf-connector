import React from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

const PostCard = ({ post , userId }) => {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate(`/course/${post.courseLink.split('/').pop()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.description}</p>
      {post.image1 && (
        <img
          src={post.image1}
          alt="Post"
          className="w-full h-auto rounded-md mb-4"
        />
      )}
      {post.video && (
        <video controls className="w-full h-auto rounded-md mb-4">
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Like button */}
      <div className="interaction-section">
                <LikeButton postId={post.id} userId={userId} />
            </div>
            
            {/* Comment section */}
            <CommentSection postId={post.id} userId={userId} />
            
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <a
          href={post.courseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mr-4"
        >
          Course Link
        </a>
        <button
          onClick={handleEnroll}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enroll
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Follow
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Like
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Comment
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Share
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Posted on: {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default PostCard;