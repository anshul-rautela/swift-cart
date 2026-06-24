package com.ecommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductReviewRequest {

    @NotBlank(message = "Reviewer name is required")
    private String reviewerName;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Minimum rating is 1 star")
    @Max(value = 5, message = "Maximum rating is 5 stars")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    private String comment;

    public ProductReviewRequest() {}

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
