package com.pedalpal.model;

import com.pedalpal.enums.BikeCategory;
import com.pedalpal.enums.FuelType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Bike implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long ownerId;
    private String name;
    private String brand;
    private String model;
    private String registrationNumber;
    private BikeCategory category;
    private FuelType fuelType;
    private String transmission;
    private Integer manufacturingYear;
    private String mileageOrRange;
    private Integer seatingCapacity;
    private String locationArea;
    private String pincode;
    private String description;
    private List<String> features;
    private String primaryImageUrl;
    private BigDecimal pricePerHour;
    private BigDecimal pricePerDay;
    private BigDecimal pricePerWeek;
    private BigDecimal securityDeposit;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer totalTrips;
    private Boolean isAvailable;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Bike() {
    }

    public Bike(Long id, Long ownerId, String name, String brand, String model, String registrationNumber,
                BikeCategory category, FuelType fuelType, String transmission, Integer manufacturingYear,
                String mileageOrRange, Integer seatingCapacity, String locationArea, String pincode,
                String description, List<String> features, String primaryImageUrl, BigDecimal pricePerHour,
                BigDecimal pricePerDay, BigDecimal pricePerWeek, BigDecimal securityDeposit, BigDecimal rating,
                Integer reviewCount, Integer totalTrips, Boolean isAvailable, Boolean isApproved,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.brand = brand;
        this.model = model;
        this.registrationNumber = registrationNumber;
        this.category = category;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.manufacturingYear = manufacturingYear;
        this.mileageOrRange = mileageOrRange;
        this.seatingCapacity = seatingCapacity;
        this.locationArea = locationArea;
        this.pincode = pincode;
        this.description = description;
        this.features = features;
        this.primaryImageUrl = primaryImageUrl;
        this.pricePerHour = pricePerHour;
        this.pricePerDay = pricePerDay;
        this.pricePerWeek = pricePerWeek;
        this.securityDeposit = securityDeposit;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.totalTrips = totalTrips;
        this.isAvailable = isAvailable;
        this.isApproved = isApproved;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public BikeCategory getCategory() {
        return category;
    }

    public void setCategory(BikeCategory category) {
        this.category = category;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public Integer getManufacturingYear() {
        return manufacturingYear;
    }

    public void setManufacturingYear(Integer manufacturingYear) {
        this.manufacturingYear = manufacturingYear;
    }

    public String getMileageOrRange() {
        return mileageOrRange;
    }

    public void setMileageOrRange(String mileageOrRange) {
        this.mileageOrRange = mileageOrRange;
    }

    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    public String getLocationArea() {
        return locationArea;
    }

    public void setLocationArea(String locationArea) {
        this.locationArea = locationArea;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public BigDecimal getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(BigDecimal pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public BigDecimal getPricePerWeek() {
        return pricePerWeek;
    }

    public void setPricePerWeek(BigDecimal pricePerWeek) {
        this.pricePerWeek = pricePerWeek;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getTotalTrips() {
        return totalTrips;
    }

    public void setTotalTrips(Integer totalTrips) {
        this.totalTrips = totalTrips;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Boolean getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
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
