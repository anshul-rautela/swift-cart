package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final CheckoutService checkoutService;

    @Autowired
    public OrderController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        Order order = checkoutService.getOrderByNumber(orderNumber);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrdersBySession(@RequestParam String sessionId) {
        return ResponseEntity.ok(checkoutService.getOrdersBySession(sessionId));
    }
}
