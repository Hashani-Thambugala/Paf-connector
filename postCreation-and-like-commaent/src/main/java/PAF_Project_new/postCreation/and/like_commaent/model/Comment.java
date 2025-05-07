package PAF_Project_new.postCreation.and.like_commaent.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Document(collection = "comments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @Id
    private String id;
    private String postId;
    private Long userId;
    private String content;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
}