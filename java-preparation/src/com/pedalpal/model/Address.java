package com.pedalpal.model;

import java.io.Serializable;

public class Address implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String streetAddress;
    private String area;
    private String city;
    private String state;
    private String pincode;

    public Address() {
    }

    public Address(Long id, String streetAddress, String area, String city, String state, String pincode) {
        this.id = id;
        this.streetAddress = streetAddress;
        this.area = area;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    @Override
    public String toString() {
        return streetAddress + ", " + area + ", " + city + " - " + pincode;
    }
}
