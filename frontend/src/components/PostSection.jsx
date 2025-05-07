import React, { useState } from 'react';
import PostCard from './PostCard';

const PostSection = ({ posts }) => {
  const [activeSection, setActiveSection] = useState('all');

  const allPosts = posts;
  const instructorPosts = posts.filter(post => post.userId !== 1); // Students: userId 1
  const studentPosts = posts.filter(post => post.userId == 1); // Others are Instructor

  const sections = {
    all: allPosts,
    instructor: instructorPosts,
    students: studentPosts,
  };

  return (
    <div className="mx-4 my-8 max-w-4xl mx-auto">
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeSection === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveSection('instructor')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeSection === 'instructor'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Instructor Posts
        </button>
        <button
          onClick={() => setActiveSection('students')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeSection === 'students'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Other Students' Posts
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {sections[activeSection].length > 0 ? (
          sections[activeSection].map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-600">No posts available in this section.</p>
        )}
      </div>
    </div>
  );
};

export default PostSection;