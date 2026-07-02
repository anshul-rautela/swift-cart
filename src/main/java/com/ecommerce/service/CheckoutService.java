package com.ecommerce.service;

import com.ecommerce.dto.CartSummaryDTO;
import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.PaymentSimulationResponse;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CheckoutService {

    private final CartService cartService;
    private final ProductService productService;
    private final OrderRepository orderRepository;

    @Autowired
    public CheckoutService(CartService cartService, ProductService productService, OrderRepository orderRepository) {
        this.cartService = cartService;
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public PaymentSimulationResponse processCheckout(CheckoutRequest request) {
        CartSummaryDTO cartSummary = cartService.getCartSummary(request.getSessionId(), request.getPromoCode());

        if (cartSummary.getItems() == null || cartSummary.getItems().isEmpty()) {
            return new PaymentSimulationResponse(
                    false,
                    null,
                    null,
                    null,
                    request.getPaymentMethod(),
                    "Cannot process checkout. Shopping cart is empty!"
            );
        }

        // Validate stock availability
        for (CartItem item : cartSummary.getItems()) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                return new PaymentSimulationResponse(
                        false,
                        null,
                        null,
                        null,
                        request.getPaymentMethod(),
                        "Insufficient stock for product: " + product.getName() + " (Only " + product.getStockQuantity() + " remaining)"
                );
            }
        }

        // Generate Order
        String orderNumber = "AUR-" + System.currentTimeMillis() % 1000000 + "-" + (int)(Math.random() * 900 + 100);
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setSessionId(request.getSessionId());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setZipCode(request.getZipCode());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD");
        order.setPaymentStatus("PAID");
        order.setOrderStatus("PROCESSING");
        order.setTransactionId(transactionId);
        order.setDiscountAmount(cartSummary.getDiscount());
        order.setTaxAmount(cartSummary.getTax());
        order.setTotalAmount(cartSummary.getTotal());

        for (CartItem cartItem : cartSummary.getItems()) {
            OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getProduct().getPrice()
            );
            order.addItem(orderItem);

            // Deduct stock
            productService.checkAndReduceStock(cartItem.getProduct().getId(), cartItem.getQuantity());
        }

        Order savedOrder = orderRepository.save(order);

        // Clear user cart after payment success
        cartService.clearCart(request.getSessionId());

        return new PaymentSimulationResponse(
                true,
                transactionId,
                savedOrder.getOrderNumber(),
                savedOrder.getTotalAmount(),
                savedOrder.getPaymentMethod(),
                "Payment successfully verified! Your order " + savedOrder.getOrderNumber() + " has been placed."
        );
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElse(null);
    }

    public List<Order> getOrdersBySession(String sessionId) {
        return orderRepository.findBySessionIdOrderByCreatedAtDesc(sessionId);
    }
}
