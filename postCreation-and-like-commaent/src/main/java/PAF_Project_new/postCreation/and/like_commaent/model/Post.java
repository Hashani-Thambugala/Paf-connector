package PAF_Project_new.postCreation.and.like_commaent.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    private String id;
    private String title;
    private String description;
    private String image1;
    private String image2;
    private String image3;
    private String video;
    private Long userId;
    private String courseLink;
}