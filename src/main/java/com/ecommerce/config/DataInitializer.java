package com.ecommerce.config;

import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public DataInitializer(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() > 0) {
            return; // Data already exists
        }

        List<Product> products = Arrays.asList(
                new Product(
                        "Aura Wireless Noise-Canceling Headphones",
                        "Experience high-fidelity spatial audio with active noise cancellation, 40-hour battery life, and ultra-plush memory foam earcups.",
                        new BigDecimal("299.99"),
                        new BigDecimal("349.99"),
                        "Audio & Sound",
                        25,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                        "BESTSELLER",
                        true
                ),
                new Product(
                        "Vapor Pro Smartwatch Ultra",
                        "Titanium casing, sapphire crystal display, dual-frequency GPS, health monitoring sensors, and 7-day battery life.",
                        new BigDecimal("399.00"),
                        new BigDecimal("449.00"),
                        "Smart Devices",
                        18,
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                        "HOT",
                        true
                ),
                new Product(
                        "Lumina RGB Mechanical Gaming Keyboard",
                        "Hot-swappable tactile mechanical switches, per-key RGB backlighting, aircraft-grade aluminum frame, and wireless Bluetooth 5.2 connection.",
                        new BigDecimal("149.50"),
                        new BigDecimal("179.99"),
                        "Smart Devices",
                        30,
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                        "NEW",
                        true
                ),
                new Product(
                        "Minimalist Canvas Everyday Backpack",
                        "Water-resistant 1000D Cordura canvas, padded 16-inch laptop sleeve, hidden anti-theft pocket, and ergonomic shoulder straps.",
                        new BigDecimal("89.99"),
                        new BigDecimal("110.00"),
                        "Accessories",
                        45,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                        "FEATURED",
                        true
                ),
                new Product(
                        "Zenith Ceramic Pour-Over Coffee Maker",
                        "Handcrafted double-wall thermal ceramic dripper with stainless steel mesh filter for rich, velvety morning coffee.",
                        new BigDecimal("45.00"),
                        new BigDecimal("55.00"),
                        "Home & Lifestyle",
                        60,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                        "SALE",
                        false
                ),
                new Product(
                        "Aura Soundbar Cinema Pro",
                        "Dolby Atmos 5.1 Surround Sound system with wireless subwoofer, HDMI eARC, and integrated voice assistant.",
                        new BigDecimal("499.99"),
                        new BigDecimal("599.99"),
                        "Audio & Sound",
                        12,
                        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
                        "PREMIUM",
                        true
                ),
                new Product(
                        "Urban Oversized Organic Hoodie",
                        "Heavyweight 450 GSM organic cotton hoodie with brushed fleece interior, relaxed unisex fit, and subtle silicone emblem.",
                        new BigDecimal("75.00"),
                        new BigDecimal("95.00"),
                        "Fashion & Apparel",
                        50,
                        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                        "TRENDING",
                        false
                ),
                new Product(
                        "Prism Curved Gaming Monitor 27\"",
                        "165Hz Refresh Rate, 1ms Response Time, WQHD 1440p QD-OLED display with HDR600 for competitive clarity.",
                        new BigDecimal("429.99"),
                        new BigDecimal("499.99"),
                        "Smart Devices",
                        15,
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
                        "HOT",
                        true
                ),
                new Product(
                        "Nordic Ambient Desk Lamp",
                        "Dimmable LED architectural desk lamp with magnetic wireless phone charging base and color temperature slider.",
                        new BigDecimal("68.50"),
                        new BigDecimal("85.00"),
                        "Home & Lifestyle",
                        35,
                        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                        "NEW",
                        false
                )
        );

        List<Product> savedProducts = productRepository.saveAll(products);

        // Pre-seed sample reviews
        if (!savedProducts.isEmpty()) {
            Product p1 = savedProducts.get(0);
            reviewRepository.save(new Review(p1.getId(), "Sarah Jenkins", 5, "Absolutly stunning sound quality! The noise cancellation completely silences office noise."));
            reviewRepository.save(new Review(p1.getId(), "Alex Rivera", 5, "Comfortable for 8+ hour work sessions. Battery lasts for days!"));
            
            p1.setRating(5.0);
            p1.setReviewCount(2);
            productRepository.save(p1);

            Product p2 = savedProducts.get(1);
            reviewRepository.save(new Review(p2.getId(), "Michael Vance", 5, "Sleek smartwatch with super accurate heart rate tracking during workouts."));
            p2.setRating(5.0);
            p2.setReviewCount(1);
            productRepository.save(p2);
        }

        System.out.println(">>> AuraCommerce sample database initialized with " + savedProducts.size() + " products.");
    }
}
