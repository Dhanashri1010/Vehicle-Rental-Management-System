package com.pedalpal.model;

import com.pedalpal.enums.UserRole;
import java.io.Serializable;
import java.time.LocalDateTime;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String passwordHash;
    private UserRole role;
    private String drivingLicenceNumber;
    private Address address;
    private Boolean isVerified;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(Long id, String fullName, String email, String phoneNumber, String passwordHash,
                UserRole role, String drivingLicenceNumber, Address address, Boolean isVerified,
                String avatarUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.role = role;
        this.drivingLicenceNumber = drivingLicenceNumber;
        this.address = address;
        this.isVerified = isVerified;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getDrivingLicenceNumber() {
        return drivingLicenceNumber;
    }

    public void setDrivingLicenceNumber(String drivingLicenceNumber) {
        this.drivingLicenceNumber = drivingLicenceNumber;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
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
