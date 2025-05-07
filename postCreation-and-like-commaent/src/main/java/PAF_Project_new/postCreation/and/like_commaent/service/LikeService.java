package PAF_Project_new.postCreation.and.like_commaent.service;

import PAF_Project_new.postCreation.and.like_commaent.model.Like;
import PAF_Project_new.postCreation.and.like_commaent.repo.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;

    public Like addLike(Like like) {
        if (likeRepository.findByPostIdAndUserId(like.getPostId(), like.getUserId()) != null) {
            throw new RuntimeException("User already liked this post");
        }
        return likeRepository.save(like);
    }

    public void removeLike(String postId, Long userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId);
        if (like != null) {
            likeRepository.delete(like);
        }
    }

    public int getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    public boolean hasLiked(String postId, Long userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId) != null;
    }

    public void deleteLikesByPostId(String postId) {
        likeRepository.deleteByPostId(postId);
    }
}