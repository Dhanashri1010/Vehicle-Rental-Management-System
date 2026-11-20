# PedalPal Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ BIKES : "owns"
    USERS ||--o{ BOOKINGS : "places as customer"
    USERS ||--o{ BOOKINGS : "receives as owner"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS }o--|| ADDRESSES : "resides at"

    BIKES ||--o{ BIKE_IMAGES : "has gallery of"
    BIKES ||--o{ BOOKINGS : "is reserved in"
    BIKES ||--o{ REVIEWS : "is reviewed in"

    BOOKINGS ||--|| PAYMENTS : "is billed via"
    BOOKINGS }o--o| ADDRESSES : "delivered to"

    USERS {
        bigint id PK
        string full_name
        string email UK
        string phone_number UK
        string password_hash
        enum role "CUSTOMER, OWNER, ADMIN"
        string driving_licence_number
        bigint address_id FK
        boolean is_verified
        string avatar_url
        enum status "ACTIVE, SUSPENDED, PENDING"
        timestamp created_at
    }

    ADDRESSES {
        bigint id PK
        string street_address
        string area
        string city "Pune"
        string state "Maharashtra"
        string pincode
    }

    BIKES {
        bigint id PK
        bigint owner_id FK
        string name
        string brand
        string model
        string registration_number UK
        enum category "SCOOTER, MOTORCYCLE, ELECTRIC_SCOOTER, ELECTRIC_BIKE"
        enum fuel_type "PETROL, ELECTRIC"
        enum transmission "AUTOMATIC, MANUAL"
        int manufacturing_year
        string mileage_or_range
        int seating_capacity
        string location_area
        string pincode
        text description
        json features_json
        string primary_image_url
        decimal price_per_hour
        decimal price_per_day
        decimal price_per_week
        decimal security_deposit
        decimal rating
        int review_count
        int total_trips
        boolean is_available
        boolean is_approved
    }

    BIKE_IMAGES {
        bigint id PK
        bigint bike_id FK
        string image_url
        boolean is_primary
        int display_order
    }

    BOOKINGS {
        bigint id PK
        string booking_reference UK
        bigint customer_id FK
        bigint bike_id FK
        bigint owner_id FK
        datetime pickup_datetime
        datetime return_datetime
        int duration_hours
        enum pickup_option "SELF_PICKUP, DOORSTEP_DELIVERY"
        bigint delivery_address_id FK
        decimal rent_amount
        decimal security_deposit
        decimal delivery_fee
        decimal taxes
        decimal total_amount
        enum status "REQUESTED, ACCEPTED, CONFIRMED, ONGOING, COMPLETED, CANCELLED, REJECTED"
        timestamp created_at
    }

    PAYMENTS {
        bigint id PK
        bigint booking_id FK
        string transaction_reference UK
        string payment_method
        decimal amount
        enum status "PENDING, PAID, REFUNDED, FAILED"
        json gateway_response_json
        timestamp payment_datetime
    }

    REVIEWS {
        bigint id PK
        bigint bike_id FK
        bigint customer_id FK
        int rating "1 to 5"
        text comment
        timestamp created_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        string title
        text message
        string type
        string icon
        boolean is_read
        timestamp created_at
    }
```

## Entity Cardinalities & Relationships
1. **User to Bike (1 : N)**: One owner lists 0, 1 or many bikes. Each bike is owned by exactly 1 registered user with role `OWNER`.
2. **User to Booking (1 : N)**: A customer can place multiple bookings over time. An owner receives multiple rental booking requests.
3. **Bike to Booking (1 : N)**: A single bike can be booked for multiple distinct, non-overlapping rental time slots.
4. **Booking to Payment (1 : 1)**: Each rental booking corresponds to a unique payment lifecycle record.
5. **Bike to BikeImage (1 : N)**: A bike listing contains a primary image and optional secondary angle photographs.
6. **Bike to Review (1 : N)**: A bike accumulates verified reviews from customers who booked it.
7. **User to Notification (1 : N)**: Each notification belongs strictly to its target recipient user.
