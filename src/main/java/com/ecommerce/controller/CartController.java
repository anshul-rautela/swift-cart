package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartSummaryDTO;
import com.ecommerce.dto.UpdateCartRequest;
import com.ecommerce.model.CartItem;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartSummaryDTO> getCartSummary(
            @RequestParam String sessionId,
            @RequestParam(required = false) String promoCode
    ) {
        return ResponseEntity.ok(cartService.getCartSummary(sessionId, promoCode));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartItem cartItem = cartService.addToCart(request);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartRequest request
    ) {
        CartItem updated = cartService.updateCartItemQuantity(id, request.getQuantity());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }
}
