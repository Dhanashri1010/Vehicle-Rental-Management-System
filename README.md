# PedalPal – Two-Wheeler Rental Platform (Pune)
> **"Your Ride. Your Way."**  
> A Modern, Responsive Two-Wheeler Rental Web Application Designed for Academic First Review.

---

## 📌 Executive Summary

**PedalPal** is a hyper-local, peer-to-peer and managed two-wheeler rental platform operating across major IT, university, and residential corridors of **Pune, Maharashtra** (including Hinjewadi, Kothrud, Baner, Viman Nagar, Wakad, Deccan, and Aundh).

The platform bridges the gap between bike owners seeking asset monetization and daily commuters, tourists, and IT professionals requiring flexible hourly, daily, weekly, or monthly two-wheeler rentals without vehicle ownership friction.

> [!IMPORTANT]
> **Strict Two-Wheeler Scope for Review 1**:
> In accordance with our academic specifications, the vehicle inventory consists **exclusively of two-wheelers**:
> 1. **Petrol Scooters** (e.g., Honda Activa 6G, TVS Jupiter 125, Suzuki Access 125)
> 2. **Petrol Motorcycles** (e.g., Royal Enfield Classic 350, Bajaj Pulsar NS200, Yamaha MT-15)
> 3. **Electric Scooters** (e.g., Ather 450X, Ola S1 Pro, TVS iQube)
> 4. **Electric Motorcycles** (e.g., Revolt RV400, Tork Kratos R)
> 
> *All car-related data, forms, and categories have been completely removed.*

---

## 🚀 Key Features by Portal

### 1. 🚴 Customer Portal (Rider Experience)
* **Explore & Filter Catalog (`pages/bikes.html`)**: Real-time multi-facet filtering by category, fuel type, transmission, price slider, and Pune locality.
* **Bike Details & Specs (`pages/bike-details.html`)**: Comprehensive vehicle specifications, owner trust badge, verified customer reviews, transparent pricing breakdown, and similar bike recommendations.
* **Side-by-Side Comparison Matrix (`pages/compare.html`)**: Interactive feature comparison of up to 3 two-wheelers (engine, mileage, deposit, pricing).
* **4-Step Booking Wizard (`pages/booking.html`)**:
  - *Step 1: Date & Time Selection*: Temporal collision prevention algorithm prevents double-booking of reserved vehicles.
  - *Step 2: Pickup Mode*: Option between self-pickup at owner hub or doorstep delivery across Pune.
  - *Step 3: Rider ID Proof*: Upload and preview of Indian Driving Licence and Aadhaar.
  - *Step 4: Payment Simulation*: Realistic simulated checkout supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Card, and Net Banking.
* **Rider Dashboard (`pages/customer-dashboard.html`)**: Quick metrics, active trip status, and direct call shortcuts.
* **My Rides & Invoice Modal (`pages/my-bookings.html`)**: Filterable ride history, cancel ride with 100% deposit refund calculation, and printable GST invoice view.
* **Saved Wishlist (`pages/wishlist.html`)**: Persistent bike bookmarking across sessions.
* **Multilingual Support**: Real-time language switching between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)** with persistent language preferences.
* **Browser Speech Synthesis**: Built-in "Listen" button on major pages for accessibility.

### 2. 🛡️ Bike Owner Portal (Host Management)
* **Owner Dashboard (`pages/owner-dashboard.html`)**: Metrics for registered fleet, active listings, pending rental requests, and gross earnings.
* **Fleet Management (`pages/owner-bikes.html`)**: Live availability toggle switches (`isAvailable`) that instantly update the public search catalog; listing edit and delete controls.
* **Add / Edit Bike Listing (`pages/add-bike.html`)**: Comprehensive listing wizard supporting vehicle title, brand, RTO registration number, hourly/daily/weekly rates, safety deposit, and real-time image preview.
* **Booking Request Moderation (`pages/owner-bookings.html`)**: Review pending customer bookings with 1-click **Accept** or **Reject** decisions.
* **Earnings & Bank Payouts (`pages/owner-earnings.html`)**: Financial transparency with 90% owner split, 10% platform roadside assistance fee, linked bank accounts, and payout history.

### 3. ⚙️ Administrator Operations Portal
* **Operations Command Center (`pages/admin-dashboard.html`)**: Executive overview of platform metrics (total customers, verified owners, total two-wheelers, pending approvals, gross merchandise value).
* **Customer Directory (`pages/admin-customers.html`)**: Customer search and account status moderation (Activate / Suspend).
* **Owner & RC Verification (`pages/admin-owners.html`)**: Owner KYC verification and trust badge allocation (`Verified Owner`).
* **Fleet Moderation (`pages/admin-bikes.html`)**: Listing compliance audit, instant approval toggle, and listing removal.
* **Global Booking Audit (`pages/admin-bookings.html`)**: Audit trail of all platform bookings, status filters, and financial breakdown inspection.
* **Pune Market Analytics (`pages/admin-reports.html`)**: Locality demand visualization (Hinjewadi, Kothrud, Viman Nagar, Baner, Deccan), top 5 vehicles by utilization, and platform commission reports.

---

## 🛠️ Technology Stack & Constraints

| Layer | Technologies Used | Compliance Note |
|---|---|---|
| **Structure & Layout** | HTML5, Bootstrap 5.3.2 | Semantic, mobile-first responsive grid |
| **Typography & Icons** | Google Fonts (Inter, Poppins), Bootstrap Icons 1.11 | Modern, high-contrast, accessible UI |
| **Styling & Theme** | Vanilla CSS3 (`css/style.css`, `css/components.css`, etc.) | Custom design tokens: Teal (`#0f8b8d`), Amber (`#ffb703`), Navy (`#1d2d44`) |
| **Client Scripting** | JavaScript (ES6+), jQuery 3.7.1 | Clean separation of controllers, zero inline spaghetti code |
| **Data Storage / Mock DB** | `localStorage` + JSON Data Layer (`js/storage.js`) | Replaces backend during Phase 1; simulated relational queries |
| **Backend Preparation** | Java 17+ POJOs (`java-preparation/src/com/pedalpal/`) | Ready for Spring Boot 3 REST API in Phase 2 |
| **Database Schema** | MySQL 8.0 DDL (`database/pedalpal.sql`) | Normalized 3NF schema, foreign keys, temporal constraints |

> [!NOTE]
> **Academic Constraint Adherence**: No React, Angular, Vue, Tailwind CSS, TypeScript, Node.js backend, or Firebase were utilized in this project, ensuring 100% compliance with pure frontend fundamentals.

---

## 🔑 Quick Demo Credentials (1-Click Evaluation)

The login screen (`pages/login.html`) features **1-Click Quick Demo Login** buttons for examiners:

| Role | Demo User Name | Demo Email | Demo Password | Default Landed Portal |
|---|---|---|---|---|
| **Customer** | Rahul Sharma | `rahul@example.com` | `Password@123` | `pages/customer-dashboard.html` |
| **Bike Owner** | Suresh Patil | `suresh@example.com` | `Password@123` | `pages/owner-dashboard.html` |
| **Admin** | Priya Deshmukh | `admin@pedalpal.in` | `Admin@123` | `pages/admin-dashboard.html` |

*A global demo role switcher is also present in the navbar of all portals for seamless testing.*

---

## 📂 Project Directory Structure

```text
Super30 Bike Rental Project/
├── index.html                       # Public Landing Page & Search Entry
├── README.md                        # Master Project Documentation (This File)
│
├── css/
│   ├── style.css                    # Design system variables, typography, reset
│   ├── components.css               # Cards, buttons, badges, modals, step-wizard
│   ├── responsive.css               # Breakpoints for mobile, tablet, and desktop
│   ├── customer.css                 # Customer portal custom layouts
│   ├── owner.css                    # Host dashboard & fleet management styling
│   └── admin.css                    # Admin operations dark navbar & audit tables
│
├── js/
│   ├── storage.js                   # Mock DB abstraction layer (CRUD, collision check)
│   ├── auth.js                      # Authentication, sessions, quick login, roles
│   ├── i18n.js                      # Language translations (English, Hindi, Marathi)
│   ├── validation.js                # Form validators (Indian phone, email, DL format)
│   ├── notifications.js             # Floating toasts and notification bell modal
│   ├── bikes.js                     # Catalog filtering, sorting, and detail loader
│   ├── comparison.js                # 3-bike comparison matrix logic
│   ├── wishlist.js                  # Bookmark management and wishlist grid
│   ├── booking.js                   # 4-step booking wizard & price calculation
│   ├── customer.js                  # Customer dashboard, rides list, bill viewer
│   ├── owner.js                     # Owner fleet, listing form, booking decisions
│   ├── admin.js                     # Admin metrics, user suspension, moderation
│   └── app.js                       # Global coordinator, speech synthesis, nav sync
│
├── data/
│   ├── bikes.json                   # 22 realistic Pune two-wheelers (No Cars)
│   ├── users.json                   # 41 realistic accounts (Customers, Owners, Admin)
│   ├── bookings.json                # 20 interconnected booking records
│   ├── reviews.json                 # 20 verified customer reviews
│   ├── notifications.json          # 15 realistic platform alerts
│   └── languages/
│       ├── en.json                  # English string dictionary
│       ├── hi.json                  # Hindi string dictionary (हिंदी)
│       └── mr.json                  # Marathi string dictionary (मराठी)
│
├── pages/
│   ├── bikes.html                   # Catalog with multi-attribute sidebar filters
│   ├── bike-details.html            # Bike details, specs, reviews & booking CTA
│   ├── compare.html                 # Side-by-side comparison matrix (up to 3 bikes)
│   ├── booking.html                 # 4-step wizard with temporal collision check
│   ├── wishlist.html                # Saved bikes grid
│   ├── customer-dashboard.html      # Rider dashboard & active trip hero card
│   ├── my-bookings.html             # Rider trips list & bill invoice modal
│   ├── profile.html                 # Customer personal details & verified DL
│   ├── login.html                   # Login screen with 1-click quick demo buttons
│   ├── register.html                # Registration form for Riders and Owners
│   ├── owner-dashboard.html         # Owner metrics, alerts, and pending requests
│   ├── owner-bikes.html             # Owner fleet table with live availability toggle
│   ├── add-bike.html                # Add/Edit two-wheeler listing form with preview
│   ├── owner-bookings.html          # Owner rental requests table with Accept/Reject
│   ├── owner-earnings.html          # Earnings summary, split table, bank payouts
│   ├── admin-dashboard.html         # Executive operations overview & metrics
│   ├── admin-customers.html         # Customer accounts directory & suspension
│   ├── admin-owners.html            # Owner host directory & trust badge toggle
│   ├── admin-bikes.html             # Fleet moderation and listing approval
│   ├── admin-bookings.html          # Global bookings audit log and modal inspector
│   └── admin-reports.html           # Pune locality analytics & revenue reports
│
├── database/
│   ├── pedalpal.sql                 # MySQL 8.0 DDL schema script with constraints
│   ├── ER-diagram.md                # Mermaid ER Diagram & cardinalities
│   └── database-documentation.md    # Data dictionary & temporal overlap algorithm
│
├── java-preparation/src/com/pedalpal/
│   ├── enums/                       # UserRole, BikeCategory, FuelType, BookingStatus
│   └── model/                       # User, Bike, Booking, Payment, Review, Address
│
├── documentation/
│   ├── project-overview.md          # Problem statement, objectives & Pune context
│   ├── architecture.md              # 3-tier architecture (Presentation, Spring, MySQL)
│   ├── application-workflow.md      # Sequence diagrams & booking state machines
│   └── first-review-checklist.md    # 5-minute presentation script & examiner Q&A
│
└── images/
    ├── bikes/                       # 22 vector SVGs for all motorcycle/scooter models
    ├── avatars/                     # 41 user profile SVGs
    └── banners/                     # Brand graphics (hero-motorcycle.svg)
```

---

## 💻 How to Run the Project Locally

1. **Clone or Download** the project repository to your local computer:
   ```bash
   git clone https://github.com/your-username/pedalpal.git
   cd "Super30 Bike Rental Project"
   ```

2. **Launch with any local web server**:
   * **Option A (VS Code Live Server - Recommended)**:
     - Open the project folder in **Visual Studio Code**.
     - Right-click `index.html` and click **"Open with Live Server"**.
     - The website will launch automatically at `http://127.0.0.1:5500/index.html`.
   * **Option B (Python Built-in Server)**:
     ```bash
     python -m http.server 8000
     ```
     Open `http://localhost:8000/index.html` in your browser.
   * **Option C (Node `http-server` / `npx serve`)**:
     ```bash
     npx serve .
     ```

3. **Data Persistence**:
   - The platform automatically seeds default data from `/data` into the browser's `localStorage` on initial launch.
   - Any added bikes, status toggles, or new bookings persist across page reloads.
   - To reset all data back to original state, click **"Reset Demo Data"** on the Admin Dashboard or execute `PedalPalStorage.resetDemoData()` in the browser developer console.

---

## 🎓 Academic Review 1 Preparation (Faculty Defense)

### 1. Key Highlights for Faculty:
* **Real-world Business Domain**: Two-wheeler rental logistics in high-demand Pune clusters (students, IT professionals, daily commuters).
* **Strict Two-Wheeler Scope**: 100% focused on scooters and motorcycles; zero car contamination.
* **Temporal Overlap Collision Detection**: Prevents double-booking during checkout using date-range overlapping logic:
  $$\max(\text{pickup}_A, \text{pickup}_B) < \min(\text{return}_A, \text{return}_B)$$
* **Seamless Cross-Portal Synchronization**: 
  - A Customer books an *Ather 450X* on `pages/booking.html`.
  - The Owner sees the request immediately on `pages/owner-dashboard.html` and clicks **Accept**.
  - The Customer's trip status automatically switches to **Accepted** on `pages/my-bookings.html`.
  - The Administrator sees the updated record in `pages/admin-bookings.html`.

### 2. Phase 2 Roadmap:
* Development of Spring Boot 3 RESTful microservices using the prepared Java POJOs in `java-preparation/`.
* Deployment of MySQL 8.0 database using `database/pedalpal.sql`.
* JWT (JSON Web Token) authentication with Spring Security.
* Real payment gateway integration (Razorpay / Stripe sandbox).

---

## 📄 License & Credits
Developed for **Super30 Academic Major Project – Review 1**.  
Built with passion using pure **HTML5, CSS3, JavaScript, jQuery, and Bootstrap 5**.
