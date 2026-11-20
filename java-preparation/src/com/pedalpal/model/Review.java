package com.pedalpal.model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class Review implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long bikeId;
    private Long customerId;
    private Integer rating; // 1 to 5
    private String comment;
    private LocalDateTime createdAt;

    public Review() {
    }

    public Review(Long id, Long bikeId, Long customerId, Integer rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.bikeId = bikeId;
        this.customerId = customerId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBikeId() {
        return bikeId;
    }

    public void setBikeId(Long bikeId) {
        this.bikeId = bikeId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
