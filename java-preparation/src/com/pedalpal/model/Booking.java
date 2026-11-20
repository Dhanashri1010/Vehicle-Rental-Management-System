package com.pedalpal.model;

import com.pedalpal.enums.BookingStatus;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String bookingReference;
    private Long customerId;
    private Long bikeId;
    private Long ownerId;
    private LocalDateTime pickupDateTime;
    private LocalDateTime returnDateTime;
    private Integer durationHours;
    private String pickupOption; // SELF_PICKUP or DOORSTEP_DELIVERY
    private Address deliveryAddress;
    private BigDecimal rentAmount;
    private BigDecimal securityDeposit;
    private BigDecimal deliveryFee;
    private BigDecimal taxes;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Booking() {
    }

    public Booking(Long id, String bookingReference, Long customerId, Long bikeId, Long ownerId,
                   LocalDateTime pickupDateTime, LocalDateTime returnDateTime, Integer durationHours,
                   String pickupOption, Address deliveryAddress, BigDecimal rentAmount,
                   BigDecimal securityDeposit, BigDecimal deliveryFee, BigDecimal taxes,
                   BigDecimal totalAmount, BookingStatus status, LocalDateTime createdAt,
                   LocalDateTime updatedAt) {
        this.id = id;
        this.bookingReference = bookingReference;
        this.customerId = customerId;
        this.bikeId = bikeId;
        this.ownerId = ownerId;
        this.pickupDateTime = pickupDateTime;
        this.returnDateTime = returnDateTime;
        this.durationHours = durationHours;
        this.pickupOption = pickupOption;
        this.deliveryAddress = deliveryAddress;
        this.rentAmount = rentAmount;
        this.securityDeposit = securityDeposit;
        this.deliveryFee = deliveryFee;
        this.taxes = taxes;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getBikeId() {
        return bikeId;
    }

    public void setBikeId(Long bikeId) {
        this.bikeId = bikeId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDateTime getPickupDateTime() {
        return pickupDateTime;
    }

    public void setPickupDateTime(LocalDateTime pickupDateTime) {
        this.pickupDateTime = pickupDateTime;
    }

    public LocalDateTime getReturnDateTime() {
        return returnDateTime;
    }

    public void setReturnDateTime(LocalDateTime returnDateTime) {
        this.returnDateTime = returnDateTime;
    }

    public Integer getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }

    public String getPickupOption() {
        return pickupOption;
    }

    public void setPickupOption(String pickupOption) {
        this.pickupOption = pickupOption;
    }

    public Address getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(Address deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public BigDecimal getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getTaxes() {
        return taxes;
    }

    public void setTaxes(BigDecimal taxes) {
        this.taxes = taxes;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
