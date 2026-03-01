package com.anshul.e_commerce.controller;

import com.anshul.e_commerce.entity.Order;
import com.anshul.e_commerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://swift-cart-qy1f.vercel.app"})
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }
    @GetMapping("/orders/{id}")
    public Order getOrderById(@PathVariable Long id){
        return orderService.getOrderById(id);
    }
    @GetMapping("/orders/user/{userId}")
    public List<Order>getOrdersByUserId(@PathVariable Long userId){
        return orderService.getOrdersByUserId(userId);
    }
    @PostMapping("/orders")
    public Order createOrder(@RequestBody Order order){
        return orderService.createOrder(order);
    }
    @PutMapping("/orders/{id}")
    public Order updateOrder(@PathVariable Long id,@RequestBody Order order){
        return orderService.updateOrder(id,order);
    }
    @DeleteMapping("/orders/{id}")
    public void deleteOrder(@PathVariable Long id){
        orderService.deleteOrder(id);
    }

}
