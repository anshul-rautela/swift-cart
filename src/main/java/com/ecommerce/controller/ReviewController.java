package com.ecommerce.controller;

import com.ecommerce.dto.ProductReviewRequest;
import com.ecommerce.model.Review;
import com.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<Review> addProductReview(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReviewRequest request
    ) {
        Review review = reviewService.addReview(productId, request);
        return ResponseEntity.ok(review);
    }
}
