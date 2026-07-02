package com.ecommerce.service;

import com.ecommerce.dto.ProductReviewRequest;
import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Transactional
    public Review addReview(Long productId, ProductReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        Review review = new Review(productId, request.getReviewerName(), request.getRating(), request.getComment());
        Review savedReview = reviewRepository.save(review);

        // Update product average rating
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        double avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        
        product.setRating(Math.round(avgRating * 10.0) / 10.0);
        product.setReviewCount(reviews.size());
        productRepository.save(product);

        return savedReview;
    }
}
