package com.anshul.e_commerce.controller;

import com.anshul.e_commerce.entity.CartItem;
import com.anshul.e_commerce.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemService cartItemService;

    @GetMapping("/cart/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId){
        return cartItemService.getCartItemsByUserId(userId);
    }
    @PostMapping("/cart")
    public CartItem addToCart(@RequestBody CartItem cartItem){
        return cartItemService.addToCart(cartItem);
    }
    @PutMapping("/cart/{id}")
    public CartItem updateCartItem(@PathVariable Long id,@RequestBody CartItem cartItem){
        return cartItemService.updateCartItem(id,cartItem);
    }
    @DeleteMapping("/cart/{id}")
    public void deleteCartItem(@PathVariable Long id){
        cartItemService.deleteCartItem(id);
    }
    @DeleteMapping("/cart/clear/{userId}")
    public void clearCart(@PathVariable Long userId){
        cartItemService.clearCart(userId);
    }

}
