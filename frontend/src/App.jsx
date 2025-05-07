// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostViewPage from "./page/PostViewPage";
import PostCreatePage from "./page/PostCreatePage";
import PostUpdatePage from "./page/PostUpdatePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/post-create" element={<PostCreatePage />} />
        <Route path="/post-view" element={<PostViewPage />} />
        <Route path="/post-update/:postId" element={<PostUpdatePage />} />
      </Routes>
    </Router>
  );
};

export default App;