package PAF_Project_new.postCreation.and.like_commaent.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import PAF_Project_new.postCreation.and.like_commaent.model.Comment;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByUserId(Long userId);
    void deleteByPostId(String postId);
}