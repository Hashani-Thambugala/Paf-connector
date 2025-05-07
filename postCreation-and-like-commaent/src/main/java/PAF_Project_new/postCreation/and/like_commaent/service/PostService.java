package PAF_Project_new.postCreation.and.like_commaent.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import PAF_Project_new.postCreation.and.like_commaent.model.Like;
import PAF_Project_new.postCreation.and.like_commaent.model.Post;
import PAF_Project_new.postCreation.and.like_commaent.model.Comment;
import PAF_Project_new.postCreation.and.like_commaent.repo.PostRepository;



@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private CommentService commentService;
    @Autowired
    private LikeService likeService;

    // Create a new post (unchanged)
    public Post createPost(String title, String description, MultipartFile image1, 
                           MultipartFile image2, MultipartFile image3, MultipartFile video,
                           Long userId, String courseLink) throws IOException {
        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setUserId(userId);
        post.setCourseLink(courseLink);
        
        if (image1 != null && !image1.isEmpty()) post.setImage1(fileService.saveFile(image1));
        if (image2 != null && !image2.isEmpty()) post.setImage2(fileService.saveFile(image2));
        if (image3 != null && !image3.isEmpty()) post.setImage3(fileService.saveFile(image3));
        if (video != null && !video.isEmpty()) post.setVideo(fileService.saveFile(video));
        
        return postRepository.save(post);
    }

    // Get all posts (unchanged)
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get a post by ID (unchanged)
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Updated updatePost method
    public Post updatePost(String id, String title, String description, String courseLink,
                           MultipartFile image1, MultipartFile image2, MultipartFile image3,
                           String existingImage1, String existingImage2, String existingImage3,
                           MultipartFile video) throws IOException {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post existingPost = optionalPost.get();
            
            // Update text fields
            existingPost.setTitle(title);
            existingPost.setDescription(description);
            existingPost.setCourseLink(courseLink);

            // Handle images
            if (image1 != null && !image1.isEmpty()) {
                if (existingPost.getImage1() != null) fileService.deleteFile(existingPost.getImage1());
                existingPost.setImage1(fileService.saveFile(image1));
            } else if (existingImage1 != null) {
                existingPost.setImage1(existingImage1); // Retain existing image
            } else {
                if (existingPost.getImage1() != null) fileService.deleteFile(existingPost.getImage1());
                existingPost.setImage1(null); // Clear if no new or existing image
            }

            if (image2 != null && !image2.isEmpty()) {
                if (existingPost.getImage2() != null) fileService.deleteFile(existingPost.getImage2());
                existingPost.setImage2(fileService.saveFile(image2));
            } else if (existingImage2 != null) {
                existingPost.setImage2(existingImage2);
            } else {
                if (existingPost.getImage2() != null) fileService.deleteFile(existingPost.getImage2());
                existingPost.setImage2(null);
            }

            if (image3 != null && !image3.isEmpty()) {
                if (existingPost.getImage3() != null) fileService.deleteFile(existingPost.getImage3());
                existingPost.setImage3(fileService.saveFile(image3));
            } else if (existingImage3 != null) {
                existingPost.setImage3(existingImage3);
            } else {
                if (existingPost.getImage3() != null) fileService.deleteFile(existingPost.getImage3());
                existingPost.setImage3(null);
            }

            // Handle video
            if (video != null && !video.isEmpty()) {
                if (existingPost.getVideo() != null) fileService.deleteFile(existingPost.getVideo());
                existingPost.setVideo(fileService.saveFile(video));
            } else if (existingPost.getVideo() != null) {
                // Retain existing video if no new one is uploaded
            } else {
                existingPost.setVideo(null); // Clear if no video
            }

            return postRepository.save(existingPost);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }

    // Delete a post (unchanged)
    public void deletePost(String id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (post.getImage1() != null) fileService.deleteFile(post.getImage1());
            if (post.getImage2() != null) fileService.deleteFile(post.getImage2());
            if (post.getImage3() != null) fileService.deleteFile(post.getImage3());
            if (post.getVideo() != null) fileService.deleteFile(post.getVideo());
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found with id: " + id);
        }
    }

    // Like a post
    public Post likePost(String postId, Long userId) {
        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(userId);
        likeService.addLike(like);
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

     // Unlike a post
     public Post unlikePost(String postId, Long userId) {
        likeService.removeLike(postId, userId);
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // Add comment to a post
    public Post addComment(String postId, Long userId, String content) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(content);
        commentService.addComment(comment);
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

     // Get all comments for a post
     public List<Comment> getComments(String postId) {
        return commentService.getCommentsByPostId(postId);
    }

    // Delete post (updated to handle comments and likes)
    public void deletePostComment(String id) {
        // First delete all comments and likes associated with the post
        commentService.deleteCommentsByPostId(id);
        likeService.deleteLikesByPostId(id);
        // Then delete the post
        postRepository.deleteById(id);
    }
}