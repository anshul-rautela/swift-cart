package com.ecommerce.dto;

import com.ecommerce.model.CartItem;
import java.math.BigDecimal;
import java.util.List;

public class CartSummaryDTO {

    private String sessionId;
    private List<CartItem> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal total;
    private Integer itemCount;

    public CartSummaryDTO() {}

    public CartSummaryDTO(String sessionId, List<CartItem> items, BigDecimal subtotal, BigDecimal tax, BigDecimal discount, BigDecimal total, Integer itemCount) {
        this.sessionId = sessionId;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
        this.itemCount = itemCount;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }
}
