package com.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentSimulationResponse {

    private boolean success;
    private String transactionId;
    private String orderNumber;
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String message;
    private LocalDateTime timestamp;

    public PaymentSimulationResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public PaymentSimulationResponse(boolean success, String transactionId, String orderNumber, BigDecimal amountPaid, String paymentMethod, String message) {
        this();
        this.success = success;
        this.transactionId = transactionId;
        this.orderNumber = orderNumber;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
