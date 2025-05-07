import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostCreatePage = () => {
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
    }));
    if (images.length + newImages.length > 3) {
      alert("You can upload up to 3 images only.");
      return;
    }
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (video) {
      alert("Only one video allowed. Remove the current video first.");
      return;
    }
    if (file && file.size > 100 * 1024 * 1024) {
      alert("Video file size must not exceed 100MB.");
      return;
    }
    setVideo({ id: `vid-${Date.now()}`, file });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please provide a Title and Description.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("courseLink", formData.courseLink);
      images.forEach((image, index) => {
        uploadData.append(`image${index + 1}`, image.file);
      });
      if (video) {
        uploadData.append("video", video.file);
      }

      await axios.post("http://localhost:8080/api/post/create", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploading(false);
      navigate("/post-view");
    } catch (error) {
      console.error(error);
      setUploading(false);
      setError(error.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create a New Post</h1>
      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Title </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your post title"
            style={styles.input}
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write something interesting..."
            style={{ ...styles.input, height: "100px", resize: "vertical" }}
          />
        </div>

        {/* Course Link */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Course Link (Optional)</label>
          <input
            type="url"
            id="courseLink"
            value={formData.courseLink}
            onChange={handleInputChange}
            placeholder="https://example.com"
            style={styles.input}
          />
        </div>

        {/* Upload Images */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Images (Max 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          <div style={styles.previewContainer}>
            {images.map((img) => (
              <div key={img.id} style={styles.previewItem}>
                <img
                  src={URL.createObjectURL(img.file)}
                  alt="preview"
                  style={styles.previewImage}
                />
                <button type="button" onClick={() => removeImage(img.id)} style={styles.removeBtn}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Video */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Video (Max 1)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={styles.fileInput}
          />
          {video && (
            <div style={styles.previewItem}>
              <video src={URL.createObjectURL(video.file)} controls style={styles.previewVideo} />
              <button type="button" onClick={removeVideo} style={styles.removeBtn}>
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton} disabled={uploading}>
          {uploading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="spinner" style={styles.spinner}></div> Uploading...
            </span>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    background: "linear-gradient(135deg, #fdfbfb 0%,rgb(175, 149, 255) 100%)",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
  header: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#34495e",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    transition: "border-color 0.3s",
    outline: "none",
  },
  fileInput: {
    marginTop: "5px",
    fontSize: "16px",
  },
  previewContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
    animation: "fadeIn 0.5s ease-in",
  },
  previewItem: {
    position: "relative",
    width: "150px",
    height: "auto",
    animation: "fadeIn 0.7s",
  },
  previewImage: {
    width: "100%",
    borderRadius: "10px",
    objectFit: "cover",
  },
  previewVideo: {
    width: "100%",
    borderRadius: "10px",
    maxHeight: "180px",
  },
  removeBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  progressContainer: {
    backgroundColor: "#dfe6e9",
    borderRadius: "8px",
    overflow: "hidden",
    height: "10px",
  },
  progressBar: {
    height: "10px",
    backgroundColor: "#27ae60",
    transition: "width 0.4s",
  },
  submitButton: {
    backgroundColor: "#2980b9",
    color: "white",
    padding: "14px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid #fff",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "10px",
  },
  errorBox: {
    backgroundColor: "#ffe0e0",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
};

// CSS animations
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${globalStyles}</style>`);

export default PostCreatePage;
