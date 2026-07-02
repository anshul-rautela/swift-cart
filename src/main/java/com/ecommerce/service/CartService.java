package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartSummaryDTO;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCartItems(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    @Transactional
    public CartItem addToCart(AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        Optional<CartItem> existingItemOpt = cartItemRepository.findBySessionIdAndProductId(request.getSessionId(), request.getProductId());

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(request.getSessionId(), product, request.getQuantity());
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    public CartSummaryDTO getCartSummary(String sessionId, String promoCode) {
        List<CartItem> items = cartItemRepository.findBySessionId(sessionId);

        BigDecimal subtotal = BigDecimal.ZERO;
        int itemCount = 0;

        for (CartItem item : items) {
            subtotal = subtotal.add(item.getItemTotal());
            itemCount += item.getQuantity();
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (promoCode != null && !promoCode.trim().isEmpty()) {
            if ("AURA20".equalsIgnoreCase(promoCode.trim()) || "SAVE20".equalsIgnoreCase(promoCode.trim())) {
                discount = subtotal.multiply(new BigDecimal("0.20")).setScale(2, RoundingMode.HALF_UP);
            } else if ("WELCOME10".equalsIgnoreCase(promoCode.trim())) {
                discount = subtotal.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);
            }
        }

        BigDecimal discountedSubtotal = subtotal.subtract(discount);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }

        // Standard 5% sales tax simulation
        BigDecimal tax = discountedSubtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = discountedSubtotal.add(tax);

        return new CartSummaryDTO(sessionId, items, subtotal, tax, discount, total, itemCount);
    }
}
