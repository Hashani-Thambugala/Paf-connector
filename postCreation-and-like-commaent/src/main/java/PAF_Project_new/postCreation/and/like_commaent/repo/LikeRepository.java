package PAF_Project_new.postCreation.and.like_commaent.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import PAF_Project_new.postCreation.and.like_commaent.model.Like;
import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    Like findByPostIdAndUserId(String postId, Long userId);
    void deleteByPostId(String postId);
    int countByPostId(String postId);
}