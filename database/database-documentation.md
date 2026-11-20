# PedalPal Database Architecture & Documentation

## 1. Executive Summary
The PedalPal relational database is designed for MySQL 8.0+ to support commercial bike rental operations across metropolitan regions (initially focused on Pune, Maharashtra). The schema enforces data integrity, security separation between user roles, financial precision, and temporal consistency.

## 2. Table Specifications

### 2.1 `addresses`
Stores verified geographic and delivery addresses in Pune.
- `id` (BIGINT, PK): Auto-increment unique key.
- `street_address` (VARCHAR 255): House/flat number, road, landmark.
- `area` (VARCHAR 100): Pune area (e.g. Kothrud, Baner, Hinjewadi, Wakad, Viman Nagar).
- `city` (VARCHAR 100): City name (Default: 'Pune').
- `state` (VARCHAR 100): State name (Default: 'Maharashtra').
- `pincode` (VARCHAR 10): 6-digit postal code.

### 2.2 `users`
Manages all user accounts across the three platform portals.
- `id` (BIGINT, PK): Unique user identifier.
- `full_name` (VARCHAR 120): User's legal name.
- `email` (VARCHAR 150, UNIQUE): Login credential.
- `phone_number` (VARCHAR 20, UNIQUE): Indian 10-digit mobile number.
- `password_hash` (VARCHAR 255): BCrypt / Argon2 hash.
- `role` (ENUM): 'CUSTOMER', 'OWNER', 'ADMIN'.
- `driving_licence_number` (VARCHAR 50): Required for customer rental verification.
- `address_id` (BIGINT, FK -> addresses.id).
- `is_verified` (BOOLEAN): Verification status badge.
- `avatar_url` (VARCHAR 255): Profile photo URL.
- `status` (ENUM): 'ACTIVE', 'SUSPENDED', 'PENDING'.

### 2.3 `bikes`
Stores bike and scooter listings (strictly 2-wheelers: petrol & electric; no cars).
- `id` (BIGINT, PK): Unique bike identifier.
- `owner_id` (BIGINT, FK -> users.id): Verified owner account.
- `name` (VARCHAR 150): Display title (e.g., "Honda Activa 6G").
- `brand` (VARCHAR 100): Manufacturer (e.g., Honda, Royal Enfield, Ather).
- `model` (VARCHAR 100): Model variant name.
- `registration_number` (VARCHAR 30, UNIQUE): RTO plate number.
- `category` (ENUM): 'SCOOTER', 'MOTORCYCLE', 'ELECTRIC_SCOOTER', 'ELECTRIC_BIKE'.
- `fuel_type` (ENUM): 'PETROL', 'ELECTRIC'.
- `transmission` (ENUM): 'AUTOMATIC', 'MANUAL'.
- `manufacturing_year` (INT): Year (2015 - 2030).
- `mileage_or_range` (VARCHAR 50): E.g., "45 km/l" or "105 km true range".
- `seating_capacity` (INT): 1 or 2 persons.
- `location_area` (VARCHAR 100): Pune locality for pickup/delivery.
- `price_per_hour` (DECIMAL 10,2): Hourly tariff (CHECK > 0).
- `price_per_day` (DECIMAL 10,2): Daily tariff (CHECK > 0).
- `price_per_week` (DECIMAL 10,2): Weekly discounted tariff (CHECK > 0).
- `security_deposit` (DECIMAL 10,2): Refundable safety deposit (CHECK >= 0).
- `rating` (DECIMAL 3,2): Aggregate average rating (1.00 to 5.00).
- `is_available` (BOOLEAN): Master listing availability toggle.
- `is_approved` (BOOLEAN): Administrative moderation flag.

### 2.4 `bookings`
Core transactional records tracking the reservation lifecycle.
- `id` (BIGINT, PK): Unique primary key.
- `booking_reference` (VARCHAR 40, UNIQUE): Customer-facing booking reference (e.g., BK-90124).
- `customer_id` (BIGINT, FK -> users.id).
- `bike_id` (BIGINT, FK -> bikes.id).
- `owner_id` (BIGINT, FK -> users.id).
- `pickup_datetime` (DATETIME): Start of rental.
- `return_datetime` (DATETIME): End of rental (CHECK return > pickup).
- `duration_hours` (INT): Calculated rental duration.
- `pickup_option` (ENUM): 'SELF_PICKUP', 'DOORSTEP_DELIVERY'.
- `rent_amount` (DECIMAL 10,2): Calculated base rental price.
- `security_deposit` (DECIMAL 10,2): 100% refundable security deposit.
- `delivery_fee` (DECIMAL 10,2): Optional door delivery fee (free within 5km).
- `taxes` (DECIMAL 10,2): GST / convenience charge.
- `total_amount` (DECIMAL 10,2): Sum total paid by customer.
- `status` (ENUM): 'REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED'.

### 2.5 `payments`
Financial audit log for payments and security deposit refunds.
- `id` (BIGINT, PK).
- `booking_id` (BIGINT, FK -> bookings.id).
- `transaction_reference` (VARCHAR 100, UNIQUE).
- `payment_method` (VARCHAR 50): UPI, Card, Net Banking, Simulated.
- `amount` (DECIMAL 10,2): Amount processed.
- `status` (ENUM): 'PENDING', 'PAID', 'REFUNDED', 'FAILED'.

### 2.6 `reviews`
Verified customer feedback and star ratings.
- `id` (BIGINT, PK).
- `bike_id` (BIGINT, FK -> bikes.id).
- `customer_id` (BIGINT, FK -> users.id).
- `rating` (INT): 1 to 5 stars.
- `comment` (TEXT): Customer testimonial.

### 2.7 `notifications`
System and role event alerts (new booking, status change, payout notice).
- `id` (BIGINT, PK).
- `user_id` (BIGINT, FK -> users.id).
- `title` (VARCHAR 150).
- `message` (TEXT).
- `type` (VARCHAR 30): 'info', 'success', 'warning', 'danger'.
- `is_read` (BOOLEAN): Unread badge state.

---

## 3. Critical Business Rules & Logic

### 3.1 Prevention of Overlapping Bookings
To guarantee that a bike is never double-booked, the upcoming Java Spring Boot service layer will execute temporal collision queries before accepting or confirming a booking:

```sql
SELECT COUNT(*) 
FROM bookings 
WHERE bike_id = :bikeId
  AND status IN ('ACCEPTED', 'CONFIRMED', 'ONGOING')
  AND (
      (:newPickup < return_datetime) AND (:newReturn > pickup_datetime)
  );
```
**Spring Boot Business Service Logic:**
1. If the count is > 0, an overlapping reservation exists.
2. The service throws a `BookingConflictException("The selected bike is already reserved for these dates.")`.
3. In the frontend prototype, this same logic is executed inside `js/booking.js` and `js/storage.js` against the localStorage booking table.

### 3.2 Security Deposit Integrity
- Every booking explicitly delineates `rent_amount` and `security_deposit`.
- When status transitions to `COMPLETED` or `CANCELLED`, a refund trigger issues a simulated payment refund of `security_deposit` to the customer's payment method.
