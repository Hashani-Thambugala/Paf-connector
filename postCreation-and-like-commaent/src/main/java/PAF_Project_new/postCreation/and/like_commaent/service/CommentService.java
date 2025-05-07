package PAF_Project_new.postCreation.and.like_commaent.service;

import PAF_Project_new.postCreation.and.like_commaent.model.Comment;
import PAF_Project_new.postCreation.and.like_commaent.repo.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Date;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return commentRepository.findByUserId(userId);
    }

    public Comment updateComment(String id, String content) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(content);
                    comment.setUpdatedAt(new Date());
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }

    public void deleteCommentsByPostId(String postId) {
        commentRepository.deleteByPostId(postId);
    }
}