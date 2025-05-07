package PAF_Project_new.postCreation.and.like_commaent.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "likes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Like {
    @Id
    private String id;
    private String postId;
    private Long userId;
}