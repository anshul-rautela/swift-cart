package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public List<Product> filterProducts(String category, String search, BigDecimal minPrice, BigDecimal maxPrice, String sortBy) {
        List<Product> products = productRepository.filterProducts(
                (category != null && category.trim().isEmpty()) ? null : category,
                (search != null && search.trim().isEmpty()) ? null : search,
                minPrice,
                maxPrice
        );

        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price-asc":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;
                case "price-desc":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "rating":
                    products.sort(Comparator.comparing(Product::getRating).reversed());
                    break;
                case "newest":
                    products.sort(Comparator.comparing(Product::getCreatedAt).reversed());
                    break;
                default:
                    // Keep default id / database order
                    break;
            }
        }

        return products;
    }

    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public boolean checkAndReduceStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getStockQuantity() >= quantity) {
                product.setStockQuantity(product.getStockQuantity() - quantity);
                productRepository.save(product);
                return true;
            }
        }
        return false;
    }
}
