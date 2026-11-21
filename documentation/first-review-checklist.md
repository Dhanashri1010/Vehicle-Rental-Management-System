# PedalPal - First Project Review Checklist & Presentation Guide

## 1. Quick Review Overview
- **Project:** PedalPal – Bike & Scooter Rental Platform
- **Scope:** Pure Two-Wheelers in Pune (Zero Cars)
- **Tech Stack Implemented:** HTML5, CSS3, JavaScript, jQuery 3.7.1, Bootstrap 5.3, LocalStorage + JSON Database.
- **Review Deliverables Prepared:** Java POJOs (Models + Enums), MySQL 8.0 DDL Schema Script (`pedalpal.sql`), Entity-Relationship Diagram, System Architecture, Complete 3-Portal Frontend.

---

## 2. Demo User Credentials (One-Click or Manual Login)

| Role | Name | Email | Password | Evaluation Access |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Rahul Patil | `rahul.patil@gmail.com` | `Password@123` | Login Page -> 1-Click "Customer" |
| **Owner** | Suresh Deshmukh | `suresh.bikes@gmail.com` | `Password@123` | Login Page -> 1-Click "Bike Owner" |
| **Admin** | Priya Deshmukh | `admin@pedalpal.in` | `Admin@123` | Login Page -> 1-Click "Administrator" |

---

## 3. Recommended Faculty Live Demonstration Script (5-Minute Tour)

### Step 1: Landing Page & Brand Presentation (1 Minute)
1. Open `index.html`.
2. Highlight the clean, commercial aesthetic:
   - Modern typography, high-contrast text, teal (`#0f8b8d`) action colors.
   - Tagline: *"Your Ride. Your Way."*
   - Interactive hero banner and Pune location search bar (Pickup/Return dates, time, vehicle category).
   - Show multilingual switcher: click **हिंदी** or **मराठी** to demonstrate instant translation.
   - Click the **Listen** button to demonstrate speech synthesis.

### Step 2: Explore Bikes, Filters & Compare (1 Minute)
1. Navigate to **Explore Bikes** (`pages/bikes.html`).
2. Demonstrate live filtering:
   - Filter by Category: *Scooters*, *Motorcycles*, *Electric Bikes*, *Electric Scooters*.
   - Filter by Fuel: *Petrol*, *Electric*.
   - Filter by Location: *Kothrud*, *Baner*, *Hinjewadi*.
   - Sort by: *Price: Low to High*, *Rating*.
3. Add 2 or 3 bikes to **Compare** (`pages/compare.html`) and show the side-by-side spec comparison table.
4. Add a bike to the **Wishlist** (`pages/wishlist.html`).

### Step 3: Complete Booking Flow & Collision Prevention (1.5 Minutes)
1. Select **Honda Activa 6G** or **Royal Enfield Classic 350** and click **Book Now** (`pages/booking.html`).
2. Show the 4-step wizard:
   - Step 1: Select rental dates & calculate rental amount automatically.
   - Step 2: Customer personal details & driving licence input.
   - Step 3: Choose *Doorstep Delivery* or *Self Pickup*.
   - Step 4: Transparent price breakdown (Rent + Refundable Deposit + GST).
3. Click **Confirm Booking**.
   - Show simulated confirmation dialog with auto-generated booking reference (e.g. `BK-90124`).
   - Show booking appearing immediately in **Customer Dashboard** (`pages/customer-dashboard.html`) and **My Bookings** (`pages/my-bookings.html`).

### Step 4: Owner Portal Demonstration (1 Minute)
1. Switch account to **Suresh Deshmukh** (Owner) or navigate to `pages/owner-dashboard.html`.
2. Review Owner metrics:
   - Total bikes listed (4 bikes), pending booking requests, monthly earnings.
3. Open **Booking Requests** (`pages/owner-bookings.html`):
   - Show incoming customer request and click **Accept Request** (or **Reject**).
   - Show status updating seamlessly in real-time.
4. Open **Add Bike** (`pages/add-bike.html`):
   - Demonstrate required field validation and live image preview.

### Step 5: Admin Portal & Review Deliverables (0.5 Minutes)
1. Switch to **PedalPal Admin** (`pages/admin-dashboard.html`):
   - Show platform-wide metrics (41 users, 22 bikes, 20 bookings, gross revenue).
   - Show customer management (`pages/admin-customers.html`), bike approval/deactivation (`pages/admin-bikes.html`), and booking reports (`pages/admin-reports.html`).
2. Direct faculty to the technical preparation folder:
   - `java-preparation/src/com/pedalpal/model/` (8 POJO classes + 5 enums).
   - `database/pedalpal.sql` (MySQL schema with constraints, FKs, and inserts).
   - `database/ER-diagram.md` (Mermaid ER diagram).
