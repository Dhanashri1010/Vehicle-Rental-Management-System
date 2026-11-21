# PedalPal – Two-Wheeler Rental Platform (Pune)
> **"Your Ride. Your Way."**  
> A Modern, Responsive Two-Wheeler Rental Web Application Designed for Academic Project Review.

---

## 📌 Executive Summary

**PedalPal** is a hyper-local two-wheeler rental web application designed and developed for the city of **Pune, Maharashtra** (serving key hubs including Kothrud, Baner, Hinjewadi, Viman Nagar, Wakad, Deccan, and Aundh).

The platform bridges the gap between bike owners seeking asset monetization and daily commuters, tourists, and college students requiring flexible hourly, daily, weekly, or monthly two-wheeler rentals without vehicle ownership friction.

> [!IMPORTANT]
> **Strict Two-Wheeler Scope**:
> In accordance with project specifications, the vehicle inventory consists **exclusively of two-wheelers**:
> 1. **Petrol Scooters** (e.g., Honda Activa 6G, TVS Jupiter 125, Suzuki Access 125)
> 2. **Petrol Motorcycles** (e.g., Royal Enfield Classic 350, Bajaj Pulsar NS200, Yamaha MT-15)
> 3. **Electric Scooters** (e.g., Ather 450X, Ola S1 Pro, TVS iQube)
> 4. **Electric Motorcycles** (e.g., Revolt RV400, Tork Kratos R)
> 
> *All car-related categories, forms, and data have been completely removed.*

---

## 🛠️ Technology Stack & Pure Frontend Architecture

The application is built strictly with modern frontend web standards:

| Technology | Purpose | Implementation Details |
|---|---|---|
| **HTML5** | Semantic Document Markup | Accessible semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), ARIA attributes |
| **CSS3** | Visual Design & Styling | Custom design tokens, responsive CSS variables, teal (`#0f8b8d`) and yellow (`#ffb703`) palette |
| **Bootstrap 5.3.2** | UI Framework & Grid | Responsive flexbox grid system, navbar, cards, modals, tabs, and form controls |
| **Bootstrap Icons 1.11** | Iconography | High-clarity vector icons for intuitive "WhatsApp-simple" UX |
| **JavaScript (ES6+)** | Business Logic & Controllers | Modular controllers (`auth.js`, `storage.js`, `i18n.js`, `bikes.js`, `booking.js`) |
| **jQuery 3.7.1** | DOM Manipulation & Events | Clean event delegation, interactive wizards, real-time filtering, and dynamic UI updates |
| **Client Storage** | Local Persistence | `localStorage` abstraction layer simulating relational database operations |

> [!NOTE]
> **Academic Constraint Adherence**:
> This is a **100% pure frontend web application**. It contains:
> - **NO** React, Angular, Vue, or modern frontend frameworks.
> - **NO** Tailwind CSS, Sass, or preprocessors.
> - **NO** Node.js runtime, Express backend, Python, or PHP.
> - **NO** external database servers (Firebase, Supabase, MongoDB, or MySQL server connections).
> - **NO** external network API dependencies — works seamlessly offline or via simple `file:///` and Live Server!

---

## 🌟 Key Application Features

### 1. 🔐 Comprehensive Authentication & Account Management (`pages/login.html`)
- **Guest-First Navigation**: Visitors start as unauthenticated guests. Zero automatic login of demo users.
- **Dual Login Methods**:
  - **Password Login**: Sign in with registered email or 10-digit mobile number and secure password.
  - **Login via OTP**: Enter registered 10-digit mobile number $\rightarrow$ simulated instant SMS OTP delivery $\rightarrow$ 6-digit code verification $\rightarrow$ instant sign-in.
- **Forgot & Reset Password**:
  - Step 1: Look up account by email or mobile number.
  - Step 2: Receive simulated 6-digit verification code.
  - Step 3: Enter verification code and choose new password (min 8 characters).
  - Updates password in `localStorage` and enables immediate login with new credentials.
- **Strict Role-Based Access Control (RBAC)**:
  - Guarded routes protect Customer, Owner, and Admin dashboards. Unauthorized visitors are redirected to login.
  - Safe registration on `pages/register.html` allows choosing between Customer and Bike Owner roles (Admin role creation restricted).
- **Faculty / Examiner 1-Click Access**: Dedicated testing buttons on `pages/login.html` to instantly inspect Customer, Owner, or Admin portals.

### 2. 🌐 Trilingual Localization Engine (`js/i18n.js`)
- Full native support for **English (EN)**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.
- **Embedded Client-Side Dictionaries**: All language strings are embedded directly in `js/i18n.js`, guaranteeing 0ms switching speed without network requests or CORS errors.
- **Instant DOM Updates**: Translates navigation, search forms, buttons, cards, steps, and feature descriptions on the fly.
- **Persistent Selection**: Remembers the selected language across page reloads in `localStorage`.
- **Text-to-Speech Accessibility**: Built-in "Listen" button reads out page details using the Web Speech API.

### 3. 🚴 Customer Portal (Rider Experience)
- **Explore Bikes (`pages/bikes.html`)**: Real-time multi-filter catalog by category (Scooters, Motorcycles, Electric), fuel type (Petrol, Electric), price range, and Pune localities (Kothrud, Baner, Hinjewadi, etc.).
- **Bike Details (`pages/bike-details.html`)**: Detailed technical specifications, pricing breakdown, owner trust verification, ratings, customer reviews, and similar bike recommendations.
- **Side-by-Side Comparison (`pages/compare.html`)**: Compare up to 3 two-wheelers simultaneously with highlighted differences in mileage, top speed, engine/battery specs, and security deposit.
- **4-Step Booking Wizard (`pages/booking.html`)**:
  - *Step 1: Dates & Duration*: Interactive pickup/drop dates with automatic price calculation and collision conflict detection.
  - *Step 2: Pickup Mode*: Option between self-pickup at owner hub or doorstep delivery across Pune.
  - *Step 3: Rider ID Proof*: Upload and preview of Indian Driving Licence and Aadhaar.
  - *Step 4: Payment Simulation*: Realistic checkout supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Card, and Net Banking.
- **Rider Dashboard (`pages/customer-dashboard.html`)**: Active trips, booking status, quick links, and emergency SOS roadside assistance shortcuts.
- **My Rides & Invoices (`pages/my-bookings.html`)**: Filterable ride history, trip cancellation with 100% deposit refund, and printable GST tax invoice modal.
- **Saved Wishlist (`pages/wishlist.html`)**: Save favorite two-wheelers with one-click booking.

### 4. 🛡️ Bike Owner Portal (Host Fleet Management)
- **Owner Dashboard (`pages/owner-dashboard.html`)**: Fleet metrics, total bikes listed, pending rental requests, and earnings summary.
- **Fleet Management (`pages/owner-bikes.html`)**: Live availability toggle switches (`isAvailable`) that instantly update the public search catalog; edit and delete listings.
- **Add Bike (`pages/add-bike.html`)**: Comprehensive listing wizard supporting vehicle title, brand, RTO registration number, rates (hourly, daily, weekly), deposit, and live image preview.
- **Booking Requests (`pages/owner-bookings.html`)**: Review pending customer bookings with 1-click **Accept** or **Reject** actions.
- **Earnings & Payouts (`pages/owner-earnings.html`)**: Transparent 90% owner split, 10% platform service fee, linked bank accounts, and payout history.

### 5. ⚙️ Administrator Command Center
- **Admin Dashboard (`pages/admin-dashboard.html`)**: Platform-wide metrics (total customers, verified owners, active fleet, gross revenue).
- **Customer Management (`pages/admin-customers.html`)**: Customer search, verification audit, and account status moderation (Active / Suspended).
- **Owner Verification (`pages/admin-owners.html`)**: Owner KYC verification, document checking, and trust badge allocation (`Verified Owner`).
- **Bike Moderation (`pages/admin-bikes.html`)**: Fleet compliance audit, approval toggle, and listing deactivation.
- **Booking Audits (`pages/admin-bookings.html`)**: Global booking ledger, status filters, and financial breakdown inspection.
- **Pune Market Analytics (`pages/admin-reports.html`)**: Locality demand visualization, top 5 vehicles by utilization, and platform commission breakdown.

---

## 🔑 Demo User Credentials

Use these credentials to sign in manually, test OTP login, test Password Reset, or use the 1-Click quick buttons on `pages/login.html`:

| Role | Name | Registered Email | Mobile (for OTP) | Password | Default Portal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer** | Rahul Patil | `rahul.patil@gmail.com` | `9876543210` | `Password@123` | `pages/customer-dashboard.html` |
| **Bike Owner** | Suresh Deshmukh | `suresh.bikes@gmail.com` | `9822012345` | `Password@123` | `pages/owner-dashboard.html` |
| **Administrator** | Priya Deshmukh | `admin@pedalpal.in` | `9999900000` | `Admin@123` | `pages/admin-dashboard.html` |

> [!TIP]
> **OTP Testing Tip**:
> When testing **Login via OTP**, click any of the "Quick fill" buttons on the OTP tab (`9876543210`, `9822012345`, or `9999900000`), click **Send OTP**, and then click the **Auto-Fill OTP** button to fill the generated code with one click!

---

## 📂 Project Directory Structure

```text
Super30 Bike Rental Project/
├── index.html                       # Public Landing Page & Search Hub
├── README.md                        # Master Project Documentation
│
├── css/                             # Modular Stylesheets (CSS3 & Bootstrap 5)
│   ├── admin.css                    # Administrator dashboard styles
│   ├── components.css               # Cards, buttons, badges, modals, step-wizard
│   ├── customer.css                 # Rider dashboard styles
│   ├── owner.css                    # Bike owner portal styles
│   ├── responsive.css               # Mobile, tablet, and desktop breakpoints
│   ├── scroll-story.css             # Interactive brand storytelling animations
│   └── style.css                    # Global typography, color tokens, and layout
│
├── js/                              # Pure JavaScript & jQuery Controllers
│   ├── admin.js                     # Admin portal logic & metrics
│   ├── app.js                       # Global navigation, search bar, language listener
│   ├── auth.js                      # RBAC, login, OTP login, registration, password reset
│   ├── bikes.js                     # Catalog filtering, search, and details rendering
│   ├── booking.js                   # 4-step booking wizard & collision algorithm
│   ├── comparison.js                # Up to 3-bike side-by-side comparison matrix
│   ├── customer.js                  # Customer dashboard & ride management
│   ├── i18n.js                      # Trilingual engine (EN, HI, MR embedded dictionaries)
│   ├── notifications.js             # Toast notifications & alert banner system
│   ├── owner.js                     # Owner portal, fleet management, booking requests
│   ├── scroll-story.js              # Homepage scroll animations
│   ├── storage.js                   # LocalStorage abstraction with embedded seed data
│   ├── validation.js                # Indian phone, licence, Aadhaar validation helpers
│   └── wishlist.js                  # Wishlist bookmarking logic
│
├── pages/                           # Application Views (20 HTML Pages)
│   ├── add-bike.html                # Owner: List new two-wheeler wizard
│   ├── admin-bikes.html             # Admin: Fleet approval & compliance
│   ├── admin-bookings.html          # Admin: Global booking audit ledger
│   ├── admin-customers.html         # Admin: Customer directory & moderation
│   ├── admin-dashboard.html         # Admin: Executive metrics command center
│   ├── admin-owners.html            # Admin: Owner KYC & trust badges
│   ├── admin-reports.html           # Admin: Pune market analytics & revenue
│   ├── bike-details.html            # Public: Vehicle specs, reviews, similar bikes
│   ├── bikes.html                   # Public: Searchable two-wheeler catalog
│   ├── booking.html                 # Customer: 4-step booking & checkout wizard
│   ├── compare.html                 # Public: Multi-bike comparison matrix
│   ├── customer-dashboard.html      # Customer: Rider dashboard & active trips
│   ├── login.html                   # Auth: Password & OTP login, Forgot Password
│   ├── my-bookings.html             # Customer: Ride history & printable invoice
│   ├── owner-bikes.html             # Owner: Fleet management & availability toggle
│   ├── owner-bookings.html          # Owner: Booking requests moderation
│   ├── owner-dashboard.html         # Owner: Host metrics & earnings summary
│   ├── owner-earnings.html          # Owner: Payout history & bank accounts
│   ├── profile.html                 # Shared: User profile, licence, password update
│   ├── register.html                # Auth: Customer or Owner registration
│   └── wishlist.html                # Customer: Saved favorite bikes
│
└── images/                          # Visual Assets (Real photos, SVGs, Avatars)
    ├── avatars/                     # User profile photos & avatars
    ├── banners/                     # Promotional banners & graphics
    ├── bikes/                       # Real two-wheeler photos (Activa, Classic 350, Ather, etc.)
    ├── icons/                       # Feature badges, safety seals, vehicle icons
    ├── story/                       # How it works visual story illustrations
    └── vehicles/                    # High-resolution vehicle display cards
```

---

## 🚀 How to Run the Project Locally

Because the application is built using **pure frontend technologies** with embedded datasets:

### Option 1: Direct Browser Launch (Simplest)
1. Navigate to the project root folder: `Super30 Bike Rental Project`.
2. Double-click `index.html`.
3. The website opens directly in Chrome, Firefox, Edge, or Safari with 100% functionality.

### Option 2: VS Code Live Server (Recommended for Development)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **"Open with Live Server"**.
4. The site will run at `http://127.0.0.1:5500/index.html`.

---

## 📋 Faculty & Examiner Live Demonstration Script (5-Minute Tour)

1. **Homepage & Brand Experience (`index.html`)**:
   - Inspect the clean "WhatsApp-simple" UI, high contrast, and Pune search bar.
   - Switch language to **मराठी** or **हिंदी** using the language switcher in the top navbar.
   - Click the **Listen** button to hear the accessibility speech synthesis.

2. **Explore Catalog & Compare (`pages/bikes.html`, `pages/compare.html`)**:
   - Filter by *Electric Scooters* or *Motorcycles* in *Kothrud*.
   - Add two bikes to compare and click **Compare** to inspect the side-by-side spec matrix.

3. **Login Options (`pages/login.html`)**:
   - Switch between **Password Login** and **Login via OTP**.
   - Test OTP login with Rahul Patil (`9876543210`) $\rightarrow$ Click "Send OTP" $\rightarrow$ Click "Auto-Fill OTP" $\rightarrow$ Click "Verify & Sign In".
   - Test **Forgot Password**: Enter email $\rightarrow$ receive simulated code $\rightarrow$ set new password.

4. **Booking Flow (`pages/booking.html`)**:
   - Select dates, choose *Doorstep Delivery*, upload driving licence proof, and complete simulated payment.
   - Show booking confirmation appearing immediately on **Customer Dashboard** (`pages/customer-dashboard.html`).

5. **Owner & Admin Portals (`pages/owner-dashboard.html`, `pages/admin-dashboard.html`)**:
   - Log in as Suresh Deshmukh (Owner) $\rightarrow$ inspect incoming booking requests $\rightarrow$ click **Accept**.
   - Log in as Priya Deshmukh (Admin) $\rightarrow$ inspect Pune market analytics, customer moderation, and fleet approvals.

---

## 👥 Authors & Academic Credits

- **Project Title:** PedalPal – Two-Wheeler Rental Platform (Pune)
- **Course / Program:** Super30 Project Review 1
- **Academic Year:** 2026
- **Status:** Complete Frontend Implementation Prepared for Review 1 Defense
