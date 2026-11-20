package com.pedalpal.model;

import com.pedalpal.enums.PaymentStatus;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long bookingId;
    private String transactionId;
    private String paymentMethod; // UPI, CARD, NET_BANKING, WALLET
    private BigDecimal amount;
    private PaymentStatus status;
    private String gatewayResponse;
    private LocalDateTime paymentDateTime;

    public Payment() {
    }

    public Payment(Long id, Long bookingId, String transactionId, String paymentMethod,
                   BigDecimal amount, PaymentStatus status, String gatewayResponse,
                   LocalDateTime paymentDateTime) {
        this.id = id;
        this.bookingId = bookingId;
        this.transactionId = transactionId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = status;
        this.gatewayResponse = gatewayResponse;
        this.paymentDateTime = paymentDateTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getGatewayResponse() {
        return gatewayResponse;
    }

    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }

    public LocalDateTime getPaymentDateTime() {
        return paymentDateTime;
    }

    public void setPaymentDateTime(LocalDateTime paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }
}
