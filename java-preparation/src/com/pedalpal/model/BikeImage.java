package com.pedalpal.model;

import java.io.Serializable;

public class BikeImage implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long bikeId;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer displayOrder;

    public BikeImage() {
    }

    public BikeImage(Long id, Long bikeId, String imageUrl, Boolean isPrimary, Integer displayOrder) {
        this.id = id;
        this.bikeId = bikeId;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
