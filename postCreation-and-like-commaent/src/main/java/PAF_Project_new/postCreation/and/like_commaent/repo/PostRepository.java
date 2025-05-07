package PAF_Project_new.postCreation.and.like_commaent.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import PAF_Project_new.postCreation.and.like_commaent.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    
}