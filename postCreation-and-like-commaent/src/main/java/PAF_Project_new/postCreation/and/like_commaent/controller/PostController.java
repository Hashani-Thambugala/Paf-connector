package PAF_Project_new.postCreation.and.like_commaent.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import PAF_Project_new.postCreation.and.like_commaent.model.Post;
import PAF_Project_new.postCreation.and.like_commaent.service.PostService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    // Fixed createPost method (unchanged)
    @PostMapping("/post/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "courseLink", required = false) String courseLink) {
        
        try {
            Post post = postService.createPost(title, description, image1, image2, image3, video, userId, courseLink);
            return new ResponseEntity<>(post, HttpStatus.CREATED);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all posts (unchanged)
    @GetMapping("/post/view")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get a post by ID (unchanged)
    @GetMapping("/post/view/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Updated updatePost method to handle multipart/form-data
    @PutMapping("/post/update/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "courseLink", required = false) String courseLink,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "existingImage1", required = false) String existingImage1,
            @RequestParam(value = "existingImage2", required = false) String existingImage2,
            @RequestParam(value = "existingImage3", required = false) String existingImage3,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        try {
            Post updatedPost = postService.updatePost(
                    id, title, description, courseLink,
                    image1, image2, image3,
                    existingImage1, existingImage2, existingImage3,
                    video);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a post (unchanged)
    @DeleteMapping("/post/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            postService.deletePost(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
} 