package PAF_Project_new.postCreation.and.like_commaent.controller;

import PAF_Project_new.postCreation.and.like_commaent.model.*;
import PAF_Project_new.postCreation.and.like_commaent.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/posts")
public class LikeCommentController {

    @Autowired
    private PostService postService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private LikeService likeService;

    // Like operations
    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(
            @PathVariable String postId,
            @RequestParam Long userId) {
        try {
            Post post = postService.likePost(postId, userId);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Post> unlikePost(
            @PathVariable String postId,
            @RequestParam Long userId) {
        try {
            Post post = postService.unlikePost(postId, userId);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{postId}/like/count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable String postId) {
        return new ResponseEntity<>(likeService.getLikeCount(postId), HttpStatus.OK);
    }

    @GetMapping("/{postId}/like/status")
    public ResponseEntity<Boolean> hasLiked(
            @PathVariable String postId,
            @RequestParam Long userId) {
        return new ResponseEntity<>(likeService.hasLiked(postId, userId), HttpStatus.OK);
    }

    // Comment operations
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable String postId,
            @RequestParam Long userId,
            @RequestParam String content) {
        try {
            postService.addComment(postId, userId, content);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        try {
            List<Comment> comments = postService.getComments(postId);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/commentsupdate/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @RequestParam String content) {
        try {
            Comment comment = commentService.updateComment(commentId, content);
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/commentsdelete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/users/{userId}/comments")
    public ResponseEntity<List<Comment>> getUserComments(@PathVariable Long userId) {
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}