import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PostUpdatePage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseLink: "",
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/post/view/${postId}`);
      const post = response.data;
      setFormData({
        title: post.title || "",
        description: post.description || "",
        courseLink: post.courseLink || "",
      });
      setImages(
        [post.image1, post.image2, post.image3]
          .filter(Boolean)
          .map((img, idx) => ({
            id: `existing-${idx}`,
            src: img,
          }))
      );
      setVideo(post.video ? { id: "existing-video", src: post.video } : null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load post data");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: file,
    }));
    if (images.length + newImages.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (video) {
      alert("You can upload only 1 video. Remove the existing one first.");
      return;
    }
    if (file && file.size > 100 * 1024 * 1024) {
      alert("Video file size should not exceed 100MB");
      return;
    }
    setVideo({ id: `new-${Date.now()}`, src: file });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Please fill in the required fields: Title and Description.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("courseLink", formData.courseLink);

      images.forEach((image, index) => {
        if (typeof image.src === "string") {
          uploadData.append(`existingImage${index + 1}`, image.src);
        } else {
          uploadData.append(`image${index + 1}`, image.src);
        }
      });

      if (video && typeof video.src !== "string") {
        uploadData.append("video", video.src);
      } else if (video) {
        uploadData.append("existingVideo", video.src);
      }

      const response = await axios.put(
        `http://localhost:8080/api/post/update/${postId}`,
        uploadData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      setUploading(false);
      navigate(`/post-view`);
    } catch (error) {
      console.error("Error updating post:", error);
      setUploading(false);
      setError(error.response?.data?.message || "Failed to update post. Please try again.");
    }
  };

  const getImageSource = (image) => {
    if (typeof image.src === "string") {
      return `http://localhost:8080/uploads/${image.src}`;
    } else {
      return URL.createObjectURL(image.src);
    }
  };

  const getVideoSource = (video) => {
    if (typeof video.src === "string") {
      return `http://localhost:8080/uploads/${video.src}`;
    } else {
      return URL.createObjectURL(video.src);
    }
  };

  if (loading) return <div style={{ textAlign: "center", fontSize: "18px", padding: "20px" }}>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "20px",
          textAlign: "center",
          borderRadius: "12px 12px 0 0",
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Update Post
      </div>

      {error && (
        <div
          style={{
            color: "#dc3545",
            backgroundColor: "#f8d7da",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="title"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}
          >
            Description:
          </label>
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              height: "120px",
              resize: "vertical",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="images"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}
          >
            Upload Images (Max 3):
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ fontSize: "16px" }}
          />
          <p style={{ marginTop: "10px", color: "#666" }}>Current Images: {images.length}/3</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {images.map((image) => (
              <div
                key={image.id}
                style={{
                  position: "relative",
                  width: "160px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={getImageSource(image)}
                  alt={`Image ${image.id}`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                    console.error(`Failed to load image: ${image.src}`);
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  onMouseOver={() => setHoveredButton(image.id)}
                  onMouseOut={() => setHoveredButton(null)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: hoveredButton === image.id ? "6px 12px" : "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background-color 0.3s, padding 0.2s, width 0.2s",
                    width: hoveredButton === image.id ? "auto" : "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {hoveredButton === image.id ? "Remove" : "X"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="video"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}
          >
            Upload Video (Max 1):
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            style={{ fontSize: "16px" }}
          />
          {video && (
            <div
              style={{
                position: "relative",
                width: "320px",
                marginTop: "15px",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <video
                src={getVideoSource(video)}
                controls
                style={{ width: "100%", height: "auto", display: "block" }}
                onError={(e) => {
                  console.error(`Failed to load video: ${video.src}`);
                }}
              />
              <button
                type="button"
                onClick={removeVideo}
                onMouseOver={() => setHoveredButton("video")}
                onMouseOut={() => setHoveredButton(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: hoveredButton === "video" ? "6px 12px" : "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background-color 0.3s, padding 0.2s, width 0.2s",
                  width: hoveredButton === "video" ? "auto" : "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
              >
                {hoveredButton === "video" ? "Remove" : "X"}
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            htmlFor="courseLink"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}
          >
            Course Link (Optional):
          </label>
          <input
            type="url"
            id="courseLink"
            value={formData.courseLink}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        {uploading && (
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                width: "100%",
                backgroundColor: "#e9ecef",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "12px",
                  backgroundColor: "#28a745",
                  borderRadius: "8px",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
            <p style={{ marginTop: "10px", color: "#666", textAlign: "center" }}>
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "12px 30px",
            backgroundColor: uploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s, transform 0.2s",
            display: "block",
            margin: "0 auto",
          }}
          onMouseOver={(e) => !uploading && (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => !uploading && (e.target.style.backgroundColor = "#007bff")}
          onMouseDown={(e) => !uploading && (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => !uploading && (e.target.style.transform = "scale(1)")}
        >
          {uploading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default PostUpdatePage;