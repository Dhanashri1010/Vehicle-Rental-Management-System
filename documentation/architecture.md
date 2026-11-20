# PedalPal System Architecture

## 1. High-Level Architecture Flow

```
+-------------------------------------------------------------------+
|                           PRESENTATION TIER                       |
|   HTML5 + CSS3 (Bootstrap 5) + JavaScript + jQuery 3.7.1          |
|                                                                   |
|   +-------------------+  +-------------------+  +---------------+ |
|   |  Customer Portal  |  | Bike Owner Portal |  | Admin Portal  | |
|   +-------------------+  +-------------------+  +---------------+ |
|             ^                      ^                    ^         |
|             +----------------------+--------------------+         |
|                                    |                              |
|                     Client-Side Controller Modules:               |
|            auth.js | bikes.js | booking.js | customer.js          |
|             owner.js | admin.js | i18n.js | storage.js            |
+-------------------------------------------------------------------+
                                    |
               [CURRENT PHASE: Browser LocalStorage Database]
                                    |
               [FUTURE PHASE: RESTful API Communication via JSON]
                                    v
+-------------------------------------------------------------------+
|                        APPLICATION / SERVICE TIER                 |
|                      (Proposed Java Spring Boot 3.x)              |
|                                                                   |
|   +-------------------------------------------------------------+ |
|   |  Spring Security + JWT Authentication (RBAC: Customer/Owner)| |
|   +-------------------------------------------------------------+ |
|   |  REST Controllers (@RestController):                        | |
|   |   - AuthController                                          | |
|   |   - BikeController                                          | |
|   |   - BookingController (Interval Conflict Algorithm)         | |
|   |   - OwnerController                                         | |
|   |   - AdminReportController                                   | |
|   +-------------------------------------------------------------+ |
|   |  Service Layer (@Service) Business Logic & Transactional Mgmt| |
|   +-------------------------------------------------------------+ |
|   |  Spring Data JPA Repositories (Hibernate ORM Entity Mapping)| |
|   +-------------------------------------------------------------+ |
+-------------------------------------------------------------------+
                                    |
                             JDBC Connection
                                    v
+-------------------------------------------------------------------+
|                             DATA TIER                             |
|                           (MySQL 8.0+)                            |
|                                                                   |
|   users | addresses | bikes | bike_images | bookings | payments    |
|                      reviews | notifications                      |
+-------------------------------------------------------------------+
```

## 2. Tier Breakdown

### 2.1 Presentation Tier (Frontend - Currently Implemented)
- **HTML5 & Semantic Markup:** Accessible, mobile-first layouts with zero technical jargon on user-facing views.
- **CSS3 & Bootstrap 5:** Clean, responsive design system. Primary accent teal `#0f8b8d`, secondary yellow `#ffb703`, navy headings `#0f172a`.
- **jQuery 3.7.1:** Efficient DOM manipulation, event routing, filtering, dynamic calculations.
- **Client Data Layer (`js/storage.js`):** Unified storage abstraction reading from and persisting to `localStorage` with JSON initial seed fallback.
- **Multilingual Engine (`js/i18n.js`):** Real-time UI string translation for English, Hindi, and Marathi.

### 2.2 Proposed Backend Tier (Java Spring Boot - Review Preparation)
- **Framework:** Spring Boot 3.x with Java 17/21.
- **POJO Entities:** Pre-prepared in `java-preparation/src/com/pedalpal/model/` matching relational tables.
- **Controllers:** Expose standardized REST endpoints:
  - `GET /api/v1/bikes?category=&fuel=&location=&maxPrice=`
  - `POST /api/v1/bookings`
  - `PUT /api/v1/bookings/{id}/status`
- **Business Validation:** Server-side date range verification preventing temporal overlaps across confirmed bookings on the same bike.

### 2.3 Proposed Data Tier (MySQL 8.0+ - Review Preparation)
- Schema defined in `database/pedalpal.sql`.
- Strictly enforces foreign keys (`ON DELETE RESTRICT` for financial integrity), check constraints, and unique indices on emails and registration numbers.
