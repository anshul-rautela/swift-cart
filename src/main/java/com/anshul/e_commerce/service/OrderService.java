package com.anshul.e_commerce.service;

import com.anshul.e_commerce.entity.Order;
import com.anshul.e_commerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }
    public Order getOrderById(Long id){
        Optional<Order> order =  orderRepository.findById(id);
        if(order.isEmpty()) throw new RuntimeException("Product with id "+id+"does not exist");
        return order.get();
    }

    public Order createOrder(Order order){
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }
    public void deleteOrder(Long id){
        Order order  = getOrderById(id);
        orderRepository.delete(order);
    }
    public Order updateOrder(Long id,Order order){
        order.setId(id);
        return orderRepository.save(order);
    }

    public List<Order>getOrdersByUserId(Long userId){
        return orderRepository.findByUserId(userId);
    }

}
