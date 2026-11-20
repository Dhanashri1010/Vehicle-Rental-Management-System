# PedalPal - Application Workflows

## 1. End-to-End User Journey: Customer to Owner to Admin

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer (Rahul)
    actor O as Owner (Suresh)
    actor A as Admin (PedalPal)
    participant APP as PedalPal UI
    participant DB as Storage / Database

    Note over C,APP: 1. DISCOVERY & BOOKING
    C->>APP: Browse Bikes / Filter by "Kothrud", "Scooter"
    APP->>DB: Query available bikes
    DB-->>APP: Return Honda Activa 6G
    C->>APP: Select Dates (Nov 24 - Nov 26), Choose Doorstep Delivery
    APP->>DB: Check date collision with existing bookings
    DB-->>APP: Slot Available
    C->>APP: Confirm Details & Simulate Payment
    APP->>DB: Insert Booking (Status: "REQUESTED") & Notify Owner
    APP-->>C: Show Booking Reference & Booking Summary

    Note over O,APP: 2. OWNER REVIEW & APPROVAL
    O->>APP: Log in to Bike Owner Portal
    APP->>DB: Fetch pending requests for Suresh's bikes
    DB-->>APP: Display Rahul's Activa booking request
    O->>APP: Click "Accept Request"
    APP->>DB: Update Booking Status: "ACCEPTED" & Add Notification for Customer
    APP-->>O: Updated Owner Dashboard stats & calendar

    Note over C,APP: 3. CUSTOMER CONFIRMATION
    C->>APP: Open Customer Dashboard / My Bookings
    APP->>DB: Fetch booking status
    DB-->>APP: Return Status: "ACCEPTED"
    APP-->>C: Display "Accepted by Owner. Doorstep Delivery Scheduled"

    Note over A,APP: 4. ADMINISTRATIVE AUDIT
    A->>APP: Log in to Admin Portal
    APP->>DB: Load global bookings & platform revenue metrics
    DB-->>APP: Return updated platform totals
    APP-->>A: Displays completed transaction in Booking Audit Log
```

## 2. Key Workflow Lifecycles

### 2.1 Booking State Machine
1. **REQUESTED:** Customer submits booking request.
2. **ACCEPTED:** Owner approves the request.
3. **CONFIRMED:** Doorstep delivery or pickup scheduled.
4. **ONGOING:** Customer checks in vehicle with photo check and takes keys.
5. **COMPLETED:** Vehicle returned safely; security deposit automatically refunded.
6. **CANCELLED:** Customer or owner cancels before handover; deposit refunded.
7. **REJECTED:** Owner declines booking due to schedule conflicts; full refund.

### 2.2 Owner Listing Lifecycle
1. Owner fills out `add-bike.html` form with specs and photos.
2. System validates registration number and sets `is_approved = true` (or pending admin review).
3. Bike immediately appears in explore search and customer catalog.
