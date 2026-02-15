package com.anshul.e_commerce.service;

import com.anshul.e_commerce.entity.CartItem;
import com.anshul.e_commerce.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;

    public List<CartItem> getCartItemsByUserId(Long userId){
        return cartItemRepository.findByUserId(userId);
    }


    public CartItem addToCart(CartItem cartItem){
        CartItem existingCartItem = cartItemRepository.findByUserIdAndProductId(cartItem.getUserId(),cartItem.getProductId());

        if(existingCartItem!=null) {    //already contained in cart
            existingCartItem.setQuantity(existingCartItem.getQuantity() + cartItem.getQuantity());
            return cartItemRepository.save(existingCartItem);
        }
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(Long id,CartItem cartItem){
        cartItem.setId(id);
        return cartItemRepository.save(cartItem);
    }
    public void deleteCartItem(Long id){
        cartItemRepository.deleteById(id);
    }
    public void clearCart(Long userId){
        cartItemRepository.deleteByUserId(userId);
    }




}
