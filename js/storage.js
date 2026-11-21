/**
 * PedalPal Central Data Storage Layer (js/storage.js)
 * Clean localStorage abstraction simulating backend database tables:
 * bikes, users, bookings, reviews, notifications, wishlist, compare.
 * 100% self-contained with embedded initial seed datasets.
 * Works seamlessly offline, on file:/// protocol, and any web server.
 */

const Storage = (function () {
  const KEYS = {
    BIKES: 'pedalpal_bikes',
    USERS: 'pedalpal_users',
    CURRENT_USER: 'pedalpal_current_user',
    BOOKINGS: 'pedalpal_bookings',
    REVIEWS: 'pedalpal_reviews',
    NOTIFICATIONS: 'pedalpal_notifications',
    WISHLIST: 'pedalpal_wishlist',
    COMPARE: 'pedalpal_compare'
  };

  // =========================================================================
  // EMBEDDED DEMO SEED DATASETS (Self-contained, zero-network fallback)
  // =========================================================================
  const SEED_BIKES = [
  {
    "id": "bk-01",
    "ownerId": "usr-o01",
    "name": "Honda Activa 6G",
    "brand": "Honda",
    "model": "Activa 6G Standard",
    "category": "Scooters",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "45 km/l",
    "seatingCapacity": 2,
    "location": "Kothrud, Pune",
    "pincode": "411038",
    "description": "Pune's most trusted scooter. Smooth engine, excellent city handling and great luggage storage. Ideal for college students, office workers and daily market errands.",
    "features": [
      "Sanitized Helmet Included",
      "Mobile Mount with Charger",
      "Spacious Underseat Boot",
      "Front Glove Box",
      "Doorstep Delivery"
    ],
    "image": "images/bikes/honda-activa-6g.svg",
    "additionalImages": [
      "images/bikes/honda-activa-6g.svg",
      "images/bikes/honda-activa-detail.svg"
    ],
    "pricePerHour": 40,
    "pricePerDay": 299,
    "pricePerWeek": 1799,
    "pricePerMonth": 5499,
    "securityDeposit": 500,
    "rating": 4.9,
    "reviewCount": 94,
    "totalTrips": 142,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-AK-4512"
  },
  {
    "id": "bk-02",
    "ownerId": "usr-o02",
    "name": "Royal Enfield Classic 350",
    "brand": "Royal Enfield",
    "model": "Classic 350 Reborn",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "35 km/l",
    "seatingCapacity": 2,
    "location": "Deccan Gymkhana, Pune",
    "pincode": "411004",
    "description": "The definitive highway cruiser with the signature Royal Enfield thump. Serviced regularly, smooth J-series engine, and comfortable dual touring seats for long getaways.",
    "features": [
      "2 Premium Helmets Included",
      "Pillion Backrest",
      "Crash Guard & Sump Guard",
      "Mobile Holder with Fast USB",
      "Pune Highway Assist"
    ],
    "image": "images/bikes/re-classic-350.svg",
    "additionalImages": [
      "images/bikes/re-classic-350.svg"
    ],
    "pricePerHour": 90,
    "pricePerDay": 699,
    "pricePerWeek": 4199,
    "pricePerMonth": 12999,
    "securityDeposit": 1500,
    "rating": 4.9,
    "reviewCount": 128,
    "totalTrips": 180,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-CR-8921"
  },
  {
    "id": "bk-03",
    "ownerId": "usr-o05",
    "name": "Ather 450X Gen 3",
    "brand": "Ather",
    "model": "450X Pro",
    "category": "Electric Scooters",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "105 km true range",
    "seatingCapacity": 2,
    "location": "Baner, Pune",
    "pincode": "411045",
    "description": "Hyper-smart electric scooter with zero petrol cost, lightning warp pickup, integrated Google Maps touchscreen, and super quiet glide across Baner and Pashan roads.",
    "features": [
      "Zero Petrol Cost",
      "Touchscreen Google Maps",
      "Portable Fast Charger",
      "Reverse Mode",
      "Sanitized Helmet"
    ],
    "image": "images/bikes/ather-450x.svg",
    "additionalImages": [
      "images/bikes/ather-450x.svg"
    ],
    "pricePerHour": 55,
    "pricePerDay": 399,
    "pricePerWeek": 2399,
    "pricePerMonth": 6999,
    "securityDeposit": 800,
    "rating": 4.9,
    "reviewCount": 78,
    "totalTrips": 110,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-EV-1045"
  },
  {
    "id": "bk-04",
    "ownerId": "usr-o06",
    "name": "Ola S1 Pro Gen 2",
    "brand": "Ola",
    "model": "S1 Pro",
    "category": "Electric Scooters",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "135 km true range",
    "seatingCapacity": 2,
    "location": "Hinjewadi, Pune",
    "pincode": "411057",
    "description": "High-speed electric scooter boasting top speed of 120 km/h, Bluetooth party speakers, hill hold assist, and plenty of boot space for IT gear and laptop bags.",
    "features": [
      "Built-in Bluetooth Speakers",
      "Keyless Digital Passcode",
      "Cruise Control",
      "Free Home Charger",
      "1 Clean Helmet"
    ],
    "image": "images/bikes/ola-s1.svg",
    "additionalImages": [
      "images/bikes/ola-s1.svg"
    ],
    "pricePerHour": 50,
    "pricePerDay": 369,
    "pricePerWeek": 2199,
    "pricePerMonth": 6499,
    "securityDeposit": 700,
    "rating": 4.8,
    "reviewCount": 65,
    "totalTrips": 92,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-14-EV-7832"
  },
  {
    "id": "bk-05",
    "ownerId": "usr-o03",
    "name": "Hero Splendor Plus",
    "brand": "Hero",
    "model": "Splendor+ i3S",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "65 km/l",
    "seatingCapacity": 2,
    "location": "Shivajinagar, Pune",
    "pincode": "411005",
    "description": "India's highest mileage motorcycle. Unmatched fuel economy, rugged reliability and ultra-affordable rent. The smartest pick for job commutes and city fieldwork.",
    "features": [
      "Exceptional 65+ km/l Mileage",
      "Sturdy Rear Carrier",
      "Lightweight Handling",
      "Tubeless Tyres",
      "1 Free Helmet"
    ],
    "image": "images/bikes/hero-splendor.svg",
    "additionalImages": [
      "images/bikes/hero-splendor.svg"
    ],
    "pricePerHour": 30,
    "pricePerDay": 249,
    "pricePerWeek": 1499,
    "pricePerMonth": 4499,
    "securityDeposit": 400,
    "rating": 4.9,
    "reviewCount": 156,
    "totalTrips": 240,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-SP-2291"
  },
  {
    "id": "bk-06",
    "ownerId": "usr-o07",
    "name": "Bajaj Pulsar 150 Twin Disc",
    "brand": "Bajaj",
    "model": "Pulsar 150 TD",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "45 km/l",
    "seatingCapacity": 2,
    "location": "Wakad, Pune",
    "pincode": "411057",
    "description": "Sporty street commuter with aggressive laser edging, twin disc brakes, crisp mid-range punch, and beefy front suspension for confidence on flyovers and ring roads.",
    "features": [
      "Dual Disc Brakes with ABS",
      "Sporty Wolf-Eye Pilot Lamps",
      "Tubeless Grip Tyres",
      "Mobile Mount",
      "1 Helmet Included"
    ],
    "image": "images/bikes/pulsar-150.svg",
    "additionalImages": [
      "images/bikes/pulsar-150.svg"
    ],
    "pricePerHour": 55,
    "pricePerDay": 399,
    "pricePerWeek": 2399,
    "pricePerMonth": 7199,
    "securityDeposit": 800,
    "rating": 4.7,
    "reviewCount": 84,
    "totalTrips": 115,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-14-PL-3012"
  },
  {
    "id": "bk-07",
    "ownerId": "usr-o04",
    "name": "TVS Jupiter 125",
    "brand": "TVS",
    "model": "Jupiter 125 Disc",
    "category": "Scooters",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "50 km/l",
    "seatingCapacity": 2,
    "location": "Viman Nagar, Pune",
    "pincode": "411014",
    "description": "Comfortable family scooter featuring massive 33L under-seat boot (accommodates 2 full-face helmets), external front fuel filler, and metal body for ultimate durability.",
    "features": [
      "Huge 33-Litre Dual-Helmet Boot",
      "Front External Petrol Cap",
      "Cushioned Ergonomic Seat",
      "Metal Body Construction",
      "1 Helmet"
    ],
    "image": "images/bikes/tvs-jupiter.svg",
    "additionalImages": [
      "images/bikes/tvs-jupiter.svg"
    ],
    "pricePerHour": 35,
    "pricePerDay": 279,
    "pricePerWeek": 1699,
    "pricePerMonth": 4999,
    "securityDeposit": 500,
    "rating": 4.8,
    "reviewCount": 68,
    "totalTrips": 98,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-JP-9943"
  },
  {
    "id": "bk-08",
    "ownerId": "usr-o10",
    "name": "Suzuki Access 125",
    "brand": "Suzuki",
    "model": "Access 125 Special Edition",
    "category": "Scooters",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "48 km/l",
    "seatingCapacity": 2,
    "location": "Aundh, Pune",
    "pincode": "411007",
    "description": "Retro chrome styling with lively 125cc SEP engine, plush leatherette seat, and front disc brake. Perfectly balanced weight makes it effortless for everyone.",
    "features": [
      "Retro Chrome Trim & Seat",
      "Front Pocket with USB Socket",
      "Bright LED Headlamp",
      "Eco Assist Dash Indicator",
      "1 Helmet"
    ],
    "image": "images/bikes/suzuki-access.svg",
    "additionalImages": [
      "images/bikes/suzuki-access.svg"
    ],
    "pricePerHour": 40,
    "pricePerDay": 289,
    "pricePerWeek": 1749,
    "pricePerMonth": 5199,
    "securityDeposit": 500,
    "rating": 4.8,
    "reviewCount": 92,
    "totalTrips": 138,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-AC-1278"
  },
  {
    "id": "bk-09",
    "ownerId": "usr-o09",
    "name": "Revolt RV400 Electric Bike",
    "brand": "Revolt",
    "model": "RV400 Premium",
    "category": "Electric Bikes",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "120 km true range",
    "seatingCapacity": 2,
    "location": "Kharadi, Pune",
    "pincode": "411014",
    "description": "India's first full-sized AI electric motorcycle. Enjoy genuine naked motorcycle ergonomics with zero engine vibrations, zero noise, and swappable battery ease.",
    "features": [
      "Swappable Battery System",
      "Multiple Digital Exhaust Sounds",
      "3 Riding Modes (Eco/Normal/Sport)",
      "Smart App GPS Tracking",
      "1 Helmet"
    ],
    "image": "images/bikes/revolt-rv400.svg",
    "additionalImages": [
      "images/bikes/revolt-rv400.svg"
    ],
    "pricePerHour": 60,
    "pricePerDay": 449,
    "pricePerWeek": 2699,
    "pricePerMonth": 7999,
    "securityDeposit": 900,
    "rating": 4.8,
    "reviewCount": 44,
    "totalTrips": 62,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-RV-6721"
  },
  {
    "id": "bk-10",
    "ownerId": "usr-o08",
    "name": "Yamaha FZ-S V3 FI",
    "brand": "Yamaha",
    "model": "FZ-S V3 Deluxe",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "45 km/l",
    "seatingCapacity": 2,
    "location": "Hadapsar, Pune",
    "pincode": "411028",
    "description": "Muscular roadster equipped with legendary 140mm wide radial rear tyre for rock-solid road grip, single-channel ABS, and upright touring posture.",
    "features": [
      "Fat Radial Grip Tyre",
      "Single-Channel Bosch ABS",
      "Bluetooth Y-Connect",
      "Comfort Split Seat",
      "1 Helmet Included"
    ],
    "image": "images/bikes/yamaha-fzs.svg",
    "additionalImages": [
      "images/bikes/yamaha-fzs.svg"
    ],
    "pricePerHour": 65,
    "pricePerDay": 449,
    "pricePerWeek": 2699,
    "pricePerMonth": 7799,
    "securityDeposit": 900,
    "rating": 4.8,
    "reviewCount": 71,
    "totalTrips": 104,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-FZ-8834"
  },
  {
    "id": "bk-11",
    "ownerId": "usr-o01",
    "name": "KTM Duke 200",
    "brand": "KTM",
    "model": "Duke 200 BS6",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "32 km/l",
    "seatingCapacity": 2,
    "location": "Kothrud, Pune",
    "pincode": "411038",
    "description": "High-revving 25 PS streetfighter motorcycle with lightning-quick throttle response, WP upside-down forks, and aggressive corner carving dynamics.",
    "features": [
      "25 PS Liquid-Cooled Engine",
      "Dual-Channel ABS with Supermoto Mode",
      "WP Apex Inverted Suspension",
      "Performance Rider Helmet",
      "Tubeless Radials"
    ],
    "image": "images/bikes/ktm-duke.svg",
    "additionalImages": [
      "images/bikes/ktm-duke.svg"
    ],
    "pricePerHour": 95,
    "pricePerDay": 749,
    "pricePerWeek": 4499,
    "pricePerMonth": 13999,
    "securityDeposit": 1800,
    "rating": 4.9,
    "reviewCount": 88,
    "totalTrips": 122,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-KT-0200"
  },
  {
    "id": "bk-12",
    "ownerId": "usr-o03",
    "name": "Honda CB Shine 125",
    "brand": "Honda",
    "model": "Shine 125 Drum",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "55 km/l",
    "seatingCapacity": 2,
    "location": "Shivajinagar, Pune",
    "pincode": "411005",
    "description": "Smooth 5-speed 125cc commuter that glides silently with Honda ACG starter. Exceptional ride comfort, soft suspension, and high fuel economy for long days.",
    "features": [
      "5-Speed Gearbox",
      "Silent ACG Starter Motor",
      "Combined Braking System (CBS)",
      "Long Ergonomic Seat",
      "1 Free Helmet"
    ],
    "image": "images/bikes/honda-shine.svg",
    "additionalImages": [
      "images/bikes/honda-shine.svg"
    ],
    "pricePerHour": 35,
    "pricePerDay": 269,
    "pricePerWeek": 1599,
    "pricePerMonth": 4699,
    "securityDeposit": 500,
    "rating": 4.7,
    "reviewCount": 63,
    "totalTrips": 101,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-SH-5541"
  },
  {
    "id": "bk-13",
    "ownerId": "usr-o11",
    "name": "Royal Enfield Hunter 350",
    "brand": "Royal Enfield",
    "model": "Hunter 350 Metro Dapper",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2024,
    "mileageOrRange": "36 km/l",
    "seatingCapacity": 2,
    "location": "FC Road, Pune",
    "pincode": "411004",
    "description": "Agile, lightweight roadster version of Royal Enfield. Shorter wheelbase makes it effortless to maneuver through congested Pune lanes and college avenues.",
    "features": [
      "Compact Agile Chassis",
      "Dual-Channel ABS",
      "Digi-Analog Instrument Pod",
      "Alloy Wheels & Tubeless Tyres",
      "1 Free Helmet"
    ],
    "image": "images/bikes/re-hunter-350.svg",
    "additionalImages": [
      "images/bikes/re-hunter-350.svg"
    ],
    "pricePerHour": 80,
    "pricePerDay": 599,
    "pricePerWeek": 3599,
    "pricePerMonth": 10999,
    "securityDeposit": 1200,
    "rating": 4.9,
    "reviewCount": 76,
    "totalTrips": 112,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-HN-3501"
  },
  {
    "id": "bk-14",
    "ownerId": "usr-o12",
    "name": "TVS iQube Electric S",
    "brand": "TVS",
    "model": "iQube S 3.4 kWh",
    "category": "Electric Scooters",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "100 km true range",
    "seatingCapacity": 2,
    "location": "Pimple Saudagar, Pune",
    "pincode": "411027",
    "description": "Refined, silent and highly dependable family electric scooter with 7-inch TFT screen, 5-way joystick navigation, Q-Park reverse assist, and wide footboard.",
    "features": [
      "7-inch Color TFT Display",
      "5-Way Joystick Controls",
      "Q-Park Reverse Assist",
      "Spacious 32L Under-Seat Space",
      "1 Helmet"
    ],
    "image": "images/bikes/tvs-iqube.svg",
    "additionalImages": [
      "images/bikes/tvs-iqube.svg"
    ],
    "pricePerHour": 45,
    "pricePerDay": 349,
    "pricePerWeek": 2099,
    "pricePerMonth": 6199,
    "securityDeposit": 600,
    "rating": 4.8,
    "reviewCount": 52,
    "totalTrips": 80,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-14-IQ-4412"
  },
  {
    "id": "bk-15",
    "ownerId": "usr-o13",
    "name": "TVS Apache RTR 160 4V",
    "brand": "TVS",
    "model": "Apache RTR 160 4V Special",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "45 km/l",
    "seatingCapacity": 2,
    "location": "Kothrud, Pune",
    "pincode": "411038",
    "description": "Racing pedigree motorcycle equipped with oil-cooled 4-valve engine, glide-through technology for smooth low-speed crawling in Pune traffic, and radial rear tyre.",
    "features": [
      "Glide Through Tech (Anti-Stall in Traffic)",
      "3 Ride Modes (Rain/Urban/Sport)",
      "Wave Disc Brakes with ABS",
      "Adjustable Levers",
      "1 Helmet"
    ],
    "image": "images/bikes/apache-160.svg",
    "additionalImages": [
      "images/bikes/apache-160.svg"
    ],
    "pricePerHour": 65,
    "pricePerDay": 429,
    "pricePerWeek": 2599,
    "pricePerMonth": 7499,
    "securityDeposit": 800,
    "rating": 4.8,
    "reviewCount": 59,
    "totalTrips": 89,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-AP-1604"
  },
  {
    "id": "bk-16",
    "ownerId": "usr-o14",
    "name": "Bajaj Chetak Premium",
    "brand": "Bajaj",
    "model": "Chetak Premium 2024",
    "category": "Electric Scooters",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "127 km true range",
    "seatingCapacity": 2,
    "location": "Baner, Pune",
    "pincode": "411045",
    "description": "Timeless steel-bodied electric scooter built in Pune. Elegant horseshoe DRL, soft-close glove compartments, sequential LED indicators, and premium road stance.",
    "features": [
      "Full Solid Steel Body",
      "Horseshoe LED Headlamp with DRL",
      "Color TFT Screen with Turn-by-Turn GPS",
      "Built-in Offboard Charger",
      "1 Helmet"
    ],
    "image": "images/bikes/bajaj-chetak.svg",
    "additionalImages": [
      "images/bikes/bajaj-chetak.svg"
    ],
    "pricePerHour": 50,
    "pricePerDay": 379,
    "pricePerWeek": 2249,
    "pricePerMonth": 6599,
    "securityDeposit": 700,
    "rating": 4.9,
    "reviewCount": 46,
    "totalTrips": 71,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-CK-2024"
  },
  {
    "id": "bk-17",
    "ownerId": "usr-o15",
    "name": "Yamaha RayZR 125 Hybrid",
    "brand": "Yamaha",
    "model": "RayZR 125 Fi Hybrid",
    "category": "Scooters",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "55 km/l",
    "seatingCapacity": 2,
    "location": "Wakad, Pune",
    "pincode": "411057",
    "description": "Ultra-lightweight 99 kg sporty scooter featuring smart motor generator hybrid electric assist for quick takeoff from traffic signals and remarkable fuel economy.",
    "features": [
      "Micro-Hybrid Electric Power Assist",
      "Ultra-Lightweight 99 kg Kerb Weight",
      "Tough Street-Rally Styling",
      "Front Disc Brake with UBS",
      "1 Helmet"
    ],
    "image": "images/bikes/yamaha-rayzr.svg",
    "additionalImages": [
      "images/bikes/yamaha-rayzr.svg"
    ],
    "pricePerHour": 40,
    "pricePerDay": 289,
    "pricePerWeek": 1749,
    "pricePerMonth": 5199,
    "securityDeposit": 500,
    "rating": 4.8,
    "reviewCount": 51,
    "totalTrips": 77,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-14-RZ-1250"
  },
  {
    "id": "bk-18",
    "ownerId": "usr-o17",
    "name": "Tork Kratos R Electric Bike",
    "brand": "Tork",
    "model": "Kratos R 4.0 kWh",
    "category": "Electric Bikes",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "120 km true range",
    "seatingCapacity": 2,
    "location": "Hinjewadi, Pune",
    "pincode": "411057",
    "description": "Engineered and manufactured in Pune! Premium electric street bike with 9 kW axial flux motor, fast charging from 0-80% in 1 hour, and regenerative braking.",
    "features": [
      "Pune-Engineered Axial Flux Motor",
      "Fast Charging 0-80% in 1 hr",
      "Active Throttle Regen Braking",
      "In-App Telematics & Ride Analytics",
      "1 Helmet"
    ],
    "image": "images/bikes/tork-kratos.svg",
    "additionalImages": [
      "images/bikes/tork-kratos.svg"
    ],
    "pricePerHour": 75,
    "pricePerDay": 549,
    "pricePerWeek": 3299,
    "pricePerMonth": 9999,
    "securityDeposit": 1100,
    "rating": 4.8,
    "reviewCount": 38,
    "totalTrips": 55,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-14-TK-9011"
  },
  {
    "id": "bk-19",
    "ownerId": "usr-o18",
    "name": "Hero Pleasure Plus XTEC",
    "brand": "Hero",
    "model": "Pleasure+ XTEC",
    "category": "Scooters",
    "fuelType": "Petrol",
    "transmission": "Automatic",
    "manufacturingYear": 2023,
    "mileageOrRange": "50 km/l",
    "seatingCapacity": 2,
    "location": "Hadapsar, Pune",
    "pincode": "411028",
    "description": "Compact, breezy and very easy to ride scooter with low seat height, integrated backrest for the pillion, Bluetooth phone call alerts, and LED projector beam.",
    "features": [
      "Low Seat Height (765 mm)",
      "Integrated Pillion Backrest",
      "Bluetooth Call/SMS Alert Display",
      "Metal Front Fender",
      "1 Helmet Included"
    ],
    "image": "images/bikes/hero-pleasure.svg",
    "additionalImages": [
      "images/bikes/hero-pleasure.svg"
    ],
    "pricePerHour": 35,
    "pricePerDay": 259,
    "pricePerWeek": 1549,
    "pricePerMonth": 4599,
    "securityDeposit": 500,
    "rating": 4.7,
    "reviewCount": 42,
    "totalTrips": 68,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-PL-8812"
  },
  {
    "id": "bk-20",
    "ownerId": "usr-o19",
    "name": "Bajaj Avenger Cruise 220",
    "brand": "Bajaj",
    "model": "Avenger Cruise 220",
    "category": "Motorcycles",
    "fuelType": "Petrol",
    "transmission": "Manual",
    "manufacturingYear": 2023,
    "mileageOrRange": "38 km/l",
    "seatingCapacity": 2,
    "location": "Aundh, Pune",
    "pincode": "411007",
    "description": "Relaxed low-slung cruiser with tall highway windshield, cushioned pillion backrest, forward-set footpegs, and 220cc DTS-i oil-cooled powerplant for highway cruising.",
    "features": [
      "Highway Touring Windshield",
      "Low Slung Ultra-Plush Seat",
      "Cushioned Pillion Backrest",
      "Single-Channel ABS",
      "2 Helmets Included"
    ],
    "image": "images/bikes/bajaj-avenger.svg",
    "additionalImages": [
      "images/bikes/bajaj-avenger.svg"
    ],
    "pricePerHour": 75,
    "pricePerDay": 549,
    "pricePerWeek": 3299,
    "pricePerMonth": 9899,
    "securityDeposit": 1200,
    "rating": 4.8,
    "reviewCount": 61,
    "totalTrips": 94,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-AV-2200"
  },
  {
    "id": "bk-21",
    "ownerId": "usr-o20",
    "name": "Hero Vida V1 Pro",
    "brand": "Hero",
    "model": "Vida V1 Pro Dual Battery",
    "category": "Electric Scooters",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "110 km true range",
    "seatingCapacity": 2,
    "location": "Kharadi, Pune",
    "pincode": "411014",
    "description": "Modular dual removable battery scooter from Hero MotoCorp. Remove both batteries and charge inside your apartment or office. Includes cruise control and SOS button.",
    "features": [
      "Dual Removable Batteries (Carry Indoors to Charge)",
      "Custom Riding Mode with 100+ Configurations",
      "SOS Button on Handlebar",
      "Fast 1.2 km/min Charging",
      "1 Helmet"
    ],
    "image": "images/bikes/vida-v1.svg",
    "additionalImages": [
      "images/bikes/vida-v1.svg"
    ],
    "pricePerHour": 50,
    "pricePerDay": 379,
    "pricePerWeek": 2249,
    "pricePerMonth": 6599,
    "securityDeposit": 700,
    "rating": 4.8,
    "reviewCount": 39,
    "totalTrips": 58,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-VD-0101"
  },
  {
    "id": "bk-22",
    "ownerId": "usr-o02",
    "name": "Ultraviolette F77 Mach 2",
    "brand": "Ultraviolette",
    "model": "F77 Mach 2 Recon",
    "category": "Electric Bikes",
    "fuelType": "Electric",
    "transmission": "Automatic",
    "manufacturingYear": 2024,
    "mileageOrRange": "210 km true range",
    "seatingCapacity": 2,
    "location": "Deccan Gymkhana, Pune",
    "pincode": "411004",
    "description": "Aviation-inspired flagship performance electric motorcycle. 0 to 60 km/h in 2.8 seconds, 10-level regenerative braking, ballistic mode, and 10.3 kWh aerospace battery.",
    "features": [
      "Aerospace Aluminum Frame",
      "0-60 km/h in 2.8 Seconds",
      "10-Level Dynamic Regen Braking",
      "Ballistic & Combat Flight Modes",
      "2 Premium Helmets"
    ],
    "image": "images/bikes/ultraviolette-f77.svg",
    "additionalImages": [
      "images/bikes/ultraviolette-f77.svg"
    ],
    "pricePerHour": 140,
    "pricePerDay": 1199,
    "pricePerWeek": 6999,
    "pricePerMonth": 21999,
    "securityDeposit": 3000,
    "rating": 5,
    "reviewCount": 34,
    "totalTrips": 45,
    "isAvailable": true,
    "isApproved": true,
    "registrationNumber": "MH-12-UV-0077"
  }
];

  const SEED_USERS = [
  {
    "id": "usr-c01",
    "name": "Rahul Patil",
    "phone": "9876543210",
    "email": "rahul.patil@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Kothrud",
    "licenceNumber": "MH12-2021004921",
    "status": "active",
    "avatar": "images/avatars/user-rahul.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c02",
    "name": "Pooja Kulkarni",
    "phone": "9823145678",
    "email": "pooja.kulkarni@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Baner",
    "licenceNumber": "MH14-2019001245",
    "status": "active",
    "avatar": "images/avatars/avatar-c2.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c03",
    "name": "Aditya Joshi",
    "phone": "9765432109",
    "email": "aditya.joshi@outlook.com",
    "role": "customer",
    "city": "Pune",
    "area": "Hinjewadi",
    "licenceNumber": "MH12-2020008765",
    "status": "active",
    "avatar": "images/avatars/avatar-c3.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c04",
    "name": "Sneha Deshpande",
    "phone": "9890123456",
    "email": "sneha.d@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Viman Nagar",
    "licenceNumber": "MH12-2022003412",
    "status": "active",
    "avatar": "images/avatars/avatar-c4.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c05",
    "name": "Tanmay Shinde",
    "phone": "9422019876",
    "email": "tanmay.shinde@yahoo.com",
    "role": "customer",
    "city": "Pune",
    "area": "Wakad",
    "licenceNumber": "MH14-2018005678",
    "status": "active",
    "avatar": "images/avatars/avatar-c5.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c06",
    "name": "Ananya Dixit",
    "phone": "9860124578",
    "email": "ananya.dixit@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Aundh",
    "licenceNumber": "MH12-2021009843",
    "status": "active",
    "avatar": "images/avatars/avatar-c6.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c07",
    "name": "Rohan More",
    "phone": "9881123490",
    "email": "rohan.more@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Deccan Gymkhana",
    "licenceNumber": "MH12-2017004321",
    "status": "active",
    "avatar": "images/avatars/avatar-c7.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c08",
    "name": "Pranali Gaikwad",
    "phone": "9730456123",
    "email": "pranali.g@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Hadapsar",
    "licenceNumber": "MH12-2023001982",
    "status": "active",
    "avatar": "images/avatars/avatar-c8.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c09",
    "name": "Nikhil Sawant",
    "phone": "9850123789",
    "email": "nikhil.sawant@rediffmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Kharadi",
    "licenceNumber": "MH12-2020006543",
    "status": "active",
    "avatar": "images/avatars/avatar-c9.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c10",
    "name": "Kavita Thorat",
    "phone": "9404123890",
    "email": "kavita.t@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Shivajinagar",
    "licenceNumber": "MH14-2021008765",
    "status": "active",
    "avatar": "images/avatars/avatar-c10.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c11",
    "name": "Abhishek Mane",
    "phone": "9921456780",
    "email": "abhi.mane@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "FC Road",
    "licenceNumber": "MH12-2019003210",
    "status": "active",
    "avatar": "images/avatars/avatar-c11.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c12",
    "name": "Meera Jagtap",
    "phone": "9822987123",
    "email": "meera.jagtap@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Pimple Saudagar",
    "licenceNumber": "MH14-2022005432",
    "status": "active",
    "avatar": "images/avatars/avatar-c12.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c13",
    "name": "Siddharth Chitre",
    "phone": "9766123890",
    "email": "sid.chitre@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Kothrud",
    "licenceNumber": "MH12-2018009012",
    "status": "active",
    "avatar": "images/avatars/avatar-c13.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c14",
    "name": "Shruti Kamble",
    "phone": "9890654321",
    "email": "shruti.k@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Baner",
    "licenceNumber": "MH12-2021002345",
    "status": "active",
    "avatar": "images/avatars/avatar-c14.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c15",
    "name": "Varun Jadhav",
    "phone": "9850987654",
    "email": "varun.jadhav@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Wakad",
    "licenceNumber": "MH14-2020004321",
    "status": "active",
    "avatar": "images/avatars/avatar-c15.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c16",
    "name": "Divya Nimbalkar",
    "phone": "9823654129",
    "email": "divya.n@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Viman Nagar",
    "licenceNumber": "MH12-2023008765",
    "status": "active",
    "avatar": "images/avatars/avatar-c16.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c17",
    "name": "Tejas Bhosale",
    "phone": "9423123987",
    "email": "tejas.b@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Hinjewadi",
    "licenceNumber": "MH14-2019007654",
    "status": "active",
    "avatar": "images/avatars/avatar-c17.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c18",
    "name": "Rutuja Gholap",
    "phone": "9867123456",
    "email": "rutuja.g@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Hadapsar",
    "licenceNumber": "MH12-2022004567",
    "status": "active",
    "avatar": "images/avatars/avatar-c18.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c19",
    "name": "Gaurav Kadam",
    "phone": "9881456123",
    "email": "gaurav.kadam@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Aundh",
    "licenceNumber": "MH12-2017008765",
    "status": "active",
    "avatar": "images/avatars/avatar-c19.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-c20",
    "name": "Sayali Salunkhe",
    "phone": "9764123789",
    "email": "sayali.s@gmail.com",
    "role": "customer",
    "city": "Pune",
    "area": "Kharadi",
    "licenceNumber": "MH12-2021003456",
    "status": "active",
    "avatar": "images/avatars/avatar-c20.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o01",
    "name": "Suresh Deshmukh",
    "phone": "9822012345",
    "email": "suresh.bikes@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Kothrud",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 42500,
    "avatar": "images/avatars/user-suresh.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o02",
    "name": "Vikram Shinde",
    "phone": "9881176543",
    "email": "vikram.rides@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Deccan Gymkhana",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 56000,
    "avatar": "images/avatars/avatar-o2.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o03",
    "name": "Ganesh More",
    "phone": "9423045678",
    "email": "ganesh.rentals@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Shivajinagar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 38900,
    "avatar": "images/avatars/avatar-o3.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o04",
    "name": "Anand Joshi",
    "phone": "9765432190",
    "email": "anand.scooters@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Viman Nagar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.7,
    "totalEarnings": 31200,
    "avatar": "images/avatars/avatar-o4.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o05",
    "name": "Sachin Pawar",
    "phone": "9890456123",
    "email": "sachin.pawar.bikes@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Baner",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 47800,
    "avatar": "images/avatars/avatar-o5.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o06",
    "name": "Mahesh Patil",
    "phone": "9823789012",
    "email": "mahesh.patil.rent@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Hinjewadi",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 61000,
    "avatar": "images/avatars/avatar-o6.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o07",
    "name": "Kishor Tambe",
    "phone": "9850123490",
    "email": "kishor.tambe@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Wakad",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.7,
    "totalEarnings": 29500,
    "avatar": "images/avatars/avatar-o7.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o08",
    "name": "Deepak Choudhary",
    "phone": "9422456789",
    "email": "deepak.c.rides@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Hadapsar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 34200,
    "avatar": "images/avatars/avatar-o8.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o09",
    "name": "Rajesh Gaikwad",
    "phone": "9860789123",
    "email": "rajesh.ev.rentals@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Kharadi",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 52400,
    "avatar": "images/avatars/avatar-o9.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o10",
    "name": "Sunil Kadam",
    "phone": "9881987654",
    "email": "sunil.kadam.bikes@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Aundh",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 41000,
    "avatar": "images/avatars/avatar-o10.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o11",
    "name": "Dattatray Wagh",
    "phone": "9730123987",
    "email": "datta.wagh@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "FC Road",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 37500,
    "avatar": "images/avatars/avatar-o11.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o12",
    "name": "Nitin Bhalerao",
    "phone": "9822456123",
    "email": "nitin.bhalerao@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Pimple Saudagar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.7,
    "totalEarnings": 26800,
    "avatar": "images/avatars/avatar-o12.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o13",
    "name": "Pravin Jagdale",
    "phone": "9766456789",
    "email": "pravin.jagdale@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Kothrud",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 33400,
    "avatar": "images/avatars/avatar-o13.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o14",
    "name": "Milind Soman",
    "phone": "9890123987",
    "email": "milind.soman.rides@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Baner",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 48900,
    "avatar": "images/avatars/avatar-o14.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o15",
    "name": "Amol Chougule",
    "phone": "9850456123",
    "email": "amol.chougule@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Wakad",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 39500,
    "avatar": "images/avatars/avatar-o15.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o16",
    "name": "Hemant Gurav",
    "phone": "9404789123",
    "email": "hemant.gurav@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Viman Nagar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.7,
    "totalEarnings": 28400,
    "avatar": "images/avatars/avatar-o16.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o17",
    "name": "Santosh Nalawade",
    "phone": "9823123890",
    "email": "santosh.nalawade@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Hinjewadi",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.9,
    "totalEarnings": 59000,
    "avatar": "images/avatars/avatar-o17.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o18",
    "name": "Ashok Dabhade",
    "phone": "9881234901",
    "email": "ashok.dabhade@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Hadapsar",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 35600,
    "avatar": "images/avatars/avatar-o18.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o19",
    "name": "Vijay Shirke",
    "phone": "9764567123",
    "email": "vijay.shirke@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Aundh",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.7,
    "totalEarnings": 27900,
    "avatar": "images/avatars/avatar-o19.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-o20",
    "name": "Kailas Mhaske",
    "phone": "9850789456",
    "email": "kailas.mhaske@gmail.com",
    "role": "owner",
    "city": "Pune",
    "area": "Kharadi",
    "isVerified": true,
    "badge": "Verified Owner",
    "rating": 4.8,
    "totalEarnings": 31800,
    "avatar": "images/avatars/avatar-o20.svg",
    "password": "Password@123"
  },
  {
    "id": "usr-admin-01",
    "name": "Priya Deshmukh",
    "phone": "9999900000",
    "email": "admin@pedalpal.in",
    "role": "admin",
    "city": "Pune",
    "area": "Shivajinagar",
    "avatar": "images/avatars/admin.svg",
    "password": "Admin@123"
  }
];

  const SEED_BOOKINGS = [
  {
    "id": "BK-90124",
    "bookingReference": "BK-90124",
    "bikeId": "bk-01",
    "bikeName": "Honda Activa 6G",
    "bikeCategory": "Scooters",
    "bikeImage": "images/bikes/honda-activa-6g.svg",
    "customerId": "usr-c01",
    "customerName": "Rahul Patil",
    "customerPhone": "9876543210",
    "customerEmail": "rahul.patil@gmail.com",
    "ownerId": "usr-o01",
    "ownerName": "Suresh Deshmukh",
    "ownerPhone": "9822012345",
    "pickupDate": "2026-11-21T09:00",
    "returnDate": "2026-11-22T09:00",
    "rentalDurationHours": 24,
    "pickupType": "doorstep",
    "deliveryAddress": "Flat 302, Sai Shraddha Apts, Ideal Colony, Kothrud, Pune",
    "deliveryFee": 0,
    "rentAmount": 299,
    "securityDeposit": 500,
    "helmetFee": 0,
    "taxes": 35,
    "totalAmount": 834,
    "bookingStatus": "Ongoing",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-20T18:30:00"
  },
  {
    "id": "BK-88412",
    "bookingReference": "BK-88412",
    "bikeId": "bk-02",
    "bikeName": "Royal Enfield Classic 350",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/re-classic-350.svg",
    "customerId": "usr-c03",
    "customerName": "Aditya Joshi",
    "customerPhone": "9765432109",
    "customerEmail": "aditya.joshi@outlook.com",
    "ownerId": "usr-o02",
    "ownerName": "Vikram Shinde",
    "ownerPhone": "9881176543",
    "pickupDate": "2026-11-23T08:00",
    "returnDate": "2026-11-25T20:00",
    "rentalDurationHours": 60,
    "pickupType": "self-pickup",
    "deliveryAddress": "Deccan Gymkhana Hub, FC Road, Pune",
    "deliveryFee": 0,
    "rentAmount": 2097,
    "securityDeposit": 1500,
    "helmetFee": 0,
    "taxes": 240,
    "totalAmount": 3837,
    "bookingStatus": "Confirmed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (PhonePe)",
    "createdAt": "2026-11-19T14:15:00"
  },
  {
    "id": "BK-87391",
    "bookingReference": "BK-87391",
    "bikeId": "bk-03",
    "bikeName": "Ather 450X Gen 3",
    "bikeCategory": "Electric Scooters",
    "bikeImage": "images/bikes/ather-450x.svg",
    "customerId": "usr-c02",
    "customerName": "Pooja Kulkarni",
    "customerPhone": "9823145678",
    "customerEmail": "pooja.kulkarni@gmail.com",
    "ownerId": "usr-o05",
    "ownerName": "Sachin Pawar",
    "ownerPhone": "9890456123",
    "pickupDate": "2026-11-24T10:00",
    "returnDate": "2026-11-26T18:00",
    "rentalDurationHours": 56,
    "pickupType": "doorstep",
    "deliveryAddress": "Plot 18, Pancard Club Road, Baner, Pune",
    "deliveryFee": 0,
    "rentAmount": 798,
    "securityDeposit": 800,
    "helmetFee": 0,
    "taxes": 95,
    "totalAmount": 1693,
    "bookingStatus": "Requested",
    "paymentStatus": "Pending",
    "paymentMethod": "Simulated Pay on Delivery",
    "createdAt": "2026-11-20T21:40:00"
  },
  {
    "id": "BK-86210",
    "bookingReference": "BK-86210",
    "bikeId": "bk-04",
    "bikeName": "Ola S1 Pro Gen 2",
    "bikeCategory": "Electric Scooters",
    "bikeImage": "images/bikes/ola-s1.svg",
    "customerId": "usr-c05",
    "customerName": "Tanmay Shinde",
    "customerPhone": "9422019876",
    "customerEmail": "tanmay.shinde@yahoo.com",
    "ownerId": "usr-o06",
    "ownerName": "Mahesh Patil",
    "ownerPhone": "9823789012",
    "pickupDate": "2026-11-22T09:00",
    "returnDate": "2026-11-23T09:00",
    "rentalDurationHours": 24,
    "pickupType": "doorstep",
    "deliveryAddress": "Near Datta Mandir, Wakad, Pune",
    "deliveryFee": 0,
    "rentAmount": 369,
    "securityDeposit": 700,
    "helmetFee": 0,
    "taxes": 44,
    "totalAmount": 1113,
    "bookingStatus": "Accepted",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Paytm)",
    "createdAt": "2026-11-20T11:20:00"
  },
  {
    "id": "BK-85190",
    "bookingReference": "BK-85190",
    "bikeId": "bk-05",
    "bikeName": "Hero Splendor Plus",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/hero-splendor.svg",
    "customerId": "usr-c07",
    "customerName": "Rohan More",
    "customerPhone": "9881123490",
    "customerEmail": "rohan.more@gmail.com",
    "ownerId": "usr-o03",
    "ownerName": "Ganesh More",
    "ownerPhone": "9423045678",
    "pickupDate": "2026-11-15T09:00",
    "returnDate": "2026-11-18T18:00",
    "rentalDurationHours": 81,
    "pickupType": "self-pickup",
    "deliveryAddress": "Shivajinagar Bus Stand Point, Pune",
    "deliveryFee": 0,
    "rentAmount": 747,
    "securityDeposit": 400,
    "helmetFee": 0,
    "taxes": 85,
    "totalAmount": 1232,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-14T10:00:00"
  },
  {
    "id": "BK-84180",
    "bookingReference": "BK-84180",
    "bikeId": "bk-06",
    "bikeName": "Bajaj Pulsar 150 Twin Disc",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/pulsar-150.svg",
    "customerId": "usr-c09",
    "customerName": "Nikhil Sawant",
    "customerPhone": "9850123789",
    "customerEmail": "nikhil.sawant@rediffmail.com",
    "ownerId": "usr-o07",
    "ownerName": "Kishor Tambe",
    "ownerPhone": "9850123490",
    "pickupDate": "2026-11-10T08:00",
    "returnDate": "2026-11-12T20:00",
    "rentalDurationHours": 60,
    "pickupType": "doorstep",
    "deliveryAddress": "EON IT Park, Kharadi, Pune",
    "deliveryFee": 50,
    "rentAmount": 798,
    "securityDeposit": 800,
    "helmetFee": 0,
    "taxes": 98,
    "totalAmount": 1746,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "Credit Card (HDFC)",
    "createdAt": "2026-11-09T16:45:00"
  },
  {
    "id": "BK-83170",
    "bookingReference": "BK-83170",
    "bikeId": "bk-07",
    "bikeName": "TVS Jupiter 125",
    "bikeCategory": "Scooters",
    "bikeImage": "images/bikes/tvs-jupiter.svg",
    "customerId": "usr-c04",
    "customerName": "Sneha Deshpande",
    "customerPhone": "9890123456",
    "customerEmail": "sneha.d@gmail.com",
    "ownerId": "usr-o04",
    "ownerName": "Anand Joshi",
    "ownerPhone": "9765432190",
    "pickupDate": "2026-11-12T10:00",
    "returnDate": "2026-11-13T10:00",
    "rentalDurationHours": 24,
    "pickupType": "doorstep",
    "deliveryAddress": "Near Symbiosis College, Viman Nagar, Pune",
    "deliveryFee": 0,
    "rentAmount": 279,
    "securityDeposit": 500,
    "helmetFee": 0,
    "taxes": 33,
    "totalAmount": 812,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-11T12:00:00"
  },
  {
    "id": "BK-82160",
    "bookingReference": "BK-82160",
    "bikeId": "bk-11",
    "bikeName": "KTM Duke 200",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/ktm-duke.svg",
    "customerId": "usr-c11",
    "customerName": "Abhishek Mane",
    "customerPhone": "9921456780",
    "customerEmail": "abhi.mane@gmail.com",
    "ownerId": "usr-o01",
    "ownerName": "Suresh Deshmukh",
    "ownerPhone": "9822012345",
    "pickupDate": "2026-11-18T09:00",
    "returnDate": "2026-11-19T21:00",
    "rentalDurationHours": 36,
    "pickupType": "self-pickup",
    "deliveryAddress": "Kothrud Stand, Paud Road, Pune",
    "deliveryFee": 0,
    "rentAmount": 1123,
    "securityDeposit": 1800,
    "helmetFee": 0,
    "taxes": 135,
    "totalAmount": 3058,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (PhonePe)",
    "createdAt": "2026-11-17T18:10:00"
  },
  {
    "id": "BK-81150",
    "bookingReference": "BK-81150",
    "bikeId": "bk-09",
    "bikeName": "Revolt RV400 Electric Bike",
    "bikeCategory": "Electric Bikes",
    "bikeImage": "images/bikes/revolt-rv400.svg",
    "customerId": "usr-c08",
    "customerName": "Pranali Gaikwad",
    "customerPhone": "9730456123",
    "customerEmail": "pranali.g@gmail.com",
    "ownerId": "usr-o09",
    "ownerName": "Rajesh Gaikwad",
    "ownerPhone": "9860789123",
    "pickupDate": "2026-11-28T09:00",
    "returnDate": "2026-11-29T18:00",
    "rentalDurationHours": 33,
    "pickupType": "doorstep",
    "deliveryAddress": "Magarpatta City, Hadapsar, Pune",
    "deliveryFee": 0,
    "rentAmount": 673,
    "securityDeposit": 900,
    "helmetFee": 0,
    "taxes": 78,
    "totalAmount": 1651,
    "bookingStatus": "Confirmed",
    "paymentStatus": "Paid",
    "paymentMethod": "Net Banking",
    "createdAt": "2026-11-20T14:00:00"
  },
  {
    "id": "BK-80140",
    "bookingReference": "BK-80140",
    "bikeId": "bk-13",
    "bikeName": "Royal Enfield Hunter 350",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/re-hunter-350.svg",
    "customerId": "usr-c06",
    "customerName": "Ananya Dixit",
    "customerPhone": "9860124578",
    "customerEmail": "ananya.dixit@gmail.com",
    "ownerId": "usr-o11",
    "ownerName": "Dattatray Wagh",
    "ownerPhone": "9730123987",
    "pickupDate": "2026-11-26T08:00",
    "returnDate": "2026-11-27T20:00",
    "rentalDurationHours": 36,
    "pickupType": "doorstep",
    "deliveryAddress": "ITI Road, Aundh, Pune",
    "deliveryFee": 0,
    "rentAmount": 898,
    "securityDeposit": 1200,
    "helmetFee": 0,
    "taxes": 105,
    "totalAmount": 2203,
    "bookingStatus": "Requested",
    "paymentStatus": "Pending",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-20T22:15:00"
  },
  {
    "id": "BK-79130",
    "bookingReference": "BK-79130",
    "bikeId": "bk-14",
    "bikeName": "TVS iQube Electric S",
    "bikeCategory": "Electric Scooters",
    "bikeImage": "images/bikes/tvs-iqube.svg",
    "customerId": "usr-c12",
    "customerName": "Meera Jagtap",
    "customerPhone": "9822987123",
    "customerEmail": "meera.jagtap@gmail.com",
    "ownerId": "usr-o12",
    "ownerName": "Nitin Bhalerao",
    "ownerPhone": "9822456123",
    "pickupDate": "2026-11-19T09:00",
    "returnDate": "2026-11-20T18:00",
    "rentalDurationHours": 33,
    "pickupType": "doorstep",
    "deliveryAddress": "Shivar Chowk, Pimple Saudagar, Pune",
    "deliveryFee": 0,
    "rentAmount": 523,
    "securityDeposit": 600,
    "helmetFee": 0,
    "taxes": 62,
    "totalAmount": 1185,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Paytm)",
    "createdAt": "2026-11-18T15:20:00"
  },
  {
    "id": "BK-78120",
    "bookingReference": "BK-78120",
    "bikeId": "bk-15",
    "bikeName": "TVS Apache RTR 160 4V",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/apache-160.svg",
    "customerId": "usr-c13",
    "customerName": "Siddharth Chitre",
    "customerPhone": "9766123890",
    "customerEmail": "sid.chitre@gmail.com",
    "ownerId": "usr-o13",
    "ownerName": "Pravin Jagdale",
    "ownerPhone": "9766456789",
    "pickupDate": "2026-11-25T07:00",
    "returnDate": "2026-11-25T21:00",
    "rentalDurationHours": 14,
    "pickupType": "self-pickup",
    "deliveryAddress": "Karve Road, Kothrud, Pune",
    "deliveryFee": 0,
    "rentAmount": 429,
    "securityDeposit": 800,
    "helmetFee": 0,
    "taxes": 51,
    "totalAmount": 1280,
    "bookingStatus": "Accepted",
    "paymentStatus": "Paid",
    "paymentMethod": "Debit Card",
    "createdAt": "2026-11-20T09:30:00"
  },
  {
    "id": "BK-77110",
    "bookingReference": "BK-77110",
    "bikeId": "bk-16",
    "bikeName": "Bajaj Chetak Premium",
    "bikeCategory": "Electric Scooters",
    "bikeImage": "images/bikes/bajaj-chetak.svg",
    "customerId": "usr-c14",
    "customerName": "Shruti Kamble",
    "customerPhone": "9890654321",
    "customerEmail": "shruti.k@gmail.com",
    "ownerId": "usr-o14",
    "ownerName": "Milind Soman",
    "ownerPhone": "9890123987",
    "pickupDate": "2026-11-27T10:00",
    "returnDate": "2026-11-29T18:00",
    "rentalDurationHours": 56,
    "pickupType": "doorstep",
    "deliveryAddress": "Balewadi High Street, Baner, Pune",
    "deliveryFee": 0,
    "rentAmount": 758,
    "securityDeposit": 700,
    "helmetFee": 0,
    "taxes": 91,
    "totalAmount": 1549,
    "bookingStatus": "Confirmed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-19T17:40:00"
  },
  {
    "id": "BK-76100",
    "bookingReference": "BK-76100",
    "bikeId": "bk-18",
    "bikeName": "Tork Kratos R Electric Bike",
    "bikeCategory": "Electric Bikes",
    "bikeImage": "images/bikes/tork-kratos.svg",
    "customerId": "usr-c15",
    "customerName": "Varun Jadhav",
    "customerPhone": "9850987654",
    "customerEmail": "varun.jadhav@gmail.com",
    "ownerId": "usr-o17",
    "ownerName": "Santosh Nalawade",
    "ownerPhone": "9823123890",
    "pickupDate": "2026-11-16T09:00",
    "returnDate": "2026-11-17T18:00",
    "rentalDurationHours": 33,
    "pickupType": "doorstep",
    "deliveryAddress": "Blue Ridge Township, Hinjewadi, Pune",
    "deliveryFee": 0,
    "rentAmount": 823,
    "securityDeposit": 1100,
    "helmetFee": 0,
    "taxes": 98,
    "totalAmount": 2021,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "Credit Card",
    "createdAt": "2026-11-15T11:00:00"
  },
  {
    "id": "BK-75090",
    "bookingReference": "BK-75090",
    "bikeId": "bk-20",
    "bikeName": "Bajaj Avenger Cruise 220",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/bajaj-avenger.svg",
    "customerId": "usr-c16",
    "customerName": "Divya Nimbalkar",
    "customerPhone": "9823654129",
    "customerEmail": "divya.n@gmail.com",
    "ownerId": "usr-o19",
    "ownerName": "Vijay Shirke",
    "ownerPhone": "9764567123",
    "pickupDate": "2026-11-21T07:00",
    "returnDate": "2026-11-22T21:00",
    "rentalDurationHours": 38,
    "pickupType": "self-pickup",
    "deliveryAddress": "Aundh Chest Hospital Chowk, Pune",
    "deliveryFee": 0,
    "rentAmount": 823,
    "securityDeposit": 1200,
    "helmetFee": 0,
    "taxes": 98,
    "totalAmount": 2121,
    "bookingStatus": "Cancelled",
    "paymentStatus": "Refunded",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-19T13:00:00"
  },
  {
    "id": "BK-74080",
    "bookingReference": "BK-74080",
    "bikeId": "bk-22",
    "bikeName": "Ultraviolette F77 Mach 2",
    "bikeCategory": "Electric Bikes",
    "bikeImage": "images/bikes/ultraviolette-f77.svg",
    "customerId": "usr-c17",
    "customerName": "Tejas Bhosale",
    "customerPhone": "9423123987",
    "customerEmail": "tejas.b@gmail.com",
    "ownerId": "usr-o02",
    "ownerName": "Vikram Shinde",
    "ownerPhone": "9881176543",
    "pickupDate": "2026-11-29T08:00",
    "returnDate": "2026-11-30T20:00",
    "rentalDurationHours": 36,
    "pickupType": "doorstep",
    "deliveryAddress": "Deccan Gymkhana, Pune",
    "deliveryFee": 0,
    "rentAmount": 1798,
    "securityDeposit": 3000,
    "helmetFee": 0,
    "taxes": 215,
    "totalAmount": 5013,
    "bookingStatus": "Confirmed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (PhonePe)",
    "createdAt": "2026-11-20T16:20:00"
  },
  {
    "id": "BK-73070",
    "bookingReference": "BK-73070",
    "bikeId": "bk-10",
    "bikeName": "Yamaha FZ-S V3 FI",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/yamaha-fzs.svg",
    "customerId": "usr-c18",
    "customerName": "Rutuja Gholap",
    "customerPhone": "9867123456",
    "customerEmail": "rutuja.g@gmail.com",
    "ownerId": "usr-o08",
    "ownerName": "Deepak Choudhary",
    "ownerPhone": "9422456789",
    "pickupDate": "2026-11-14T09:00",
    "returnDate": "2026-11-15T18:00",
    "rentalDurationHours": 33,
    "pickupType": "doorstep",
    "deliveryAddress": "Hadapsar Gadital, Pune",
    "deliveryFee": 0,
    "rentAmount": 673,
    "securityDeposit": 900,
    "helmetFee": 0,
    "taxes": 81,
    "totalAmount": 1654,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-13T14:10:00"
  },
  {
    "id": "BK-72060",
    "bookingReference": "BK-72060",
    "bikeId": "bk-12",
    "bikeName": "Honda CB Shine 125",
    "bikeCategory": "Motorcycles",
    "bikeImage": "images/bikes/honda-shine.svg",
    "customerId": "usr-c19",
    "customerName": "Gaurav Kadam",
    "customerPhone": "9881456123",
    "customerEmail": "gaurav.kadam@gmail.com",
    "ownerId": "usr-o03",
    "ownerName": "Ganesh More",
    "ownerPhone": "9423045678",
    "pickupDate": "2026-11-21T09:00",
    "returnDate": "2026-11-21T19:00",
    "rentalDurationHours": 10,
    "pickupType": "self-pickup",
    "deliveryAddress": "Shivajinagar Station, Pune",
    "deliveryFee": 0,
    "rentAmount": 269,
    "securityDeposit": 500,
    "helmetFee": 0,
    "taxes": 32,
    "totalAmount": 801,
    "bookingStatus": "Ongoing",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Paytm)",
    "createdAt": "2026-11-20T20:10:00"
  },
  {
    "id": "BK-71050",
    "bookingReference": "BK-71050",
    "bikeId": "bk-17",
    "bikeName": "Yamaha RayZR 125 Hybrid",
    "bikeCategory": "Scooters",
    "bikeImage": "images/bikes/yamaha-rayzr.svg",
    "customerId": "usr-c20",
    "customerName": "Sayali Salunkhe",
    "customerPhone": "9764123789",
    "customerEmail": "sayali.s@gmail.com",
    "ownerId": "usr-o15",
    "ownerName": "Amol Chougule",
    "ownerPhone": "9850456123",
    "pickupDate": "2026-11-23T09:00",
    "returnDate": "2026-11-24T18:00",
    "rentalDurationHours": 33,
    "pickupType": "doorstep",
    "deliveryAddress": "Near Phoenix Marketcity, Viman Nagar, Pune",
    "deliveryFee": 0,
    "rentAmount": 433,
    "securityDeposit": 500,
    "helmetFee": 0,
    "taxes": 52,
    "totalAmount": 985,
    "bookingStatus": "Rejected",
    "paymentStatus": "Refunded",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-20T10:00:00"
  },
  {
    "id": "BK-70040",
    "bookingReference": "BK-70040",
    "bikeId": "bk-08",
    "bikeName": "Suzuki Access 125",
    "bikeCategory": "Scooters",
    "bikeImage": "images/bikes/suzuki-access.svg",
    "customerId": "usr-c01",
    "customerName": "Rahul Patil",
    "customerPhone": "9876543210",
    "customerEmail": "rahul.patil@gmail.com",
    "ownerId": "usr-o10",
    "ownerName": "Sunil Kadam",
    "ownerPhone": "9881987654",
    "pickupDate": "2026-11-05T08:00",
    "returnDate": "2026-11-06T20:00",
    "rentalDurationHours": 36,
    "pickupType": "doorstep",
    "deliveryAddress": "Ideal Colony, Kothrud, Pune",
    "deliveryFee": 0,
    "rentAmount": 433,
    "securityDeposit": 500,
    "helmetFee": 0,
    "taxes": 52,
    "totalAmount": 985,
    "bookingStatus": "Completed",
    "paymentStatus": "Paid",
    "paymentMethod": "UPI (Google Pay)",
    "createdAt": "2026-11-04T12:00:00"
  }
];

  const SEED_REVIEWS = [
  {
    "id": "rev-01",
    "bikeId": "bk-01",
    "customerId": "usr-c01",
    "customerName": "Rahul Patil",
    "rating": 5,
    "date": "2026-11-07",
    "comment": "The Activa was spotless and delivered right on time at Kothrud. Suresh ji is extremely polite and provided a fresh sanitized helmet."
  },
  {
    "id": "rev-02",
    "bikeId": "bk-02",
    "customerId": "usr-c03",
    "customerName": "Aditya Joshi",
    "rating": 5,
    "date": "2026-11-08",
    "comment": "Rented the Classic 350 for a trip to Lavasa. Thump and pickup were fantastic, great brakes and comfort seat."
  },
  {
    "id": "rev-03",
    "bikeId": "bk-03",
    "customerId": "usr-c02",
    "customerName": "Pooja Kulkarni",
    "rating": 5,
    "date": "2026-11-12",
    "comment": "Ather 450X made my Baner-Hinjewadi commute effortless. Saved all petrol money and touchscreen maps worked smoothly."
  },
  {
    "id": "rev-04",
    "bikeId": "bk-05",
    "customerId": "usr-c07",
    "customerName": "Rohan More",
    "rating": 5,
    "date": "2026-11-19",
    "comment": "Splendor gave over 65 km/l across Pune! Ganesh ji gave full fuel tank and security money returned in 10 minutes."
  },
  {
    "id": "rev-05",
    "bikeId": "bk-06",
    "customerId": "usr-c09",
    "customerName": "Nikhil Sawant",
    "rating": 4,
    "date": "2026-11-13",
    "comment": "Great Pulsar 150 with dual disc brakes. Super grip on highway. Very responsive owner."
  },
  {
    "id": "rev-06",
    "bikeId": "bk-07",
    "customerId": "usr-c04",
    "customerName": "Sneha Deshpande",
    "rating": 5,
    "date": "2026-11-14",
    "comment": "Jupiter 125 boot space is amazing! Could easily keep 2 helmets and shopping bags. Delivered to doorstep."
  },
  {
    "id": "rev-07",
    "bikeId": "bk-11",
    "customerId": "usr-c11",
    "customerName": "Abhishek Mane",
    "rating": 5,
    "date": "2026-11-20",
    "comment": "Duke 200 rocket acceleration! In showroom condition with brand new tyres. Pure adrenaline!"
  },
  {
    "id": "rev-08",
    "bikeId": "bk-14",
    "customerId": "usr-c12",
    "customerName": "Meera Jagtap",
    "rating": 5,
    "date": "2026-11-20",
    "comment": "TVS iQube is whisper-quiet. Q-park reverse feature made parking in Pimple Saudagar markets a breeze."
  },
  {
    "id": "rev-09",
    "bikeId": "bk-18",
    "customerId": "usr-c15",
    "customerName": "Varun Jadhav",
    "rating": 5,
    "date": "2026-11-18",
    "comment": "First time riding an electric bike (Tork Kratos R). Made in Pune and performs like a beast!"
  },
  {
    "id": "rev-10",
    "bikeId": "bk-10",
    "customerId": "usr-c18",
    "customerName": "Rutuja Gholap",
    "rating": 5,
    "date": "2026-11-16",
    "comment": "Yamaha FZ radial tyre gives great stability on wet tarmac. Owner delivered right to Hadapsar Gadital."
  },
  {
    "id": "rev-11",
    "bikeId": "bk-08",
    "customerId": "usr-c01",
    "customerName": "Rahul Patil",
    "rating": 5,
    "date": "2026-11-06",
    "comment": "Access 125 suspension is very smooth for Pune potholes. Excellent service."
  },
  {
    "id": "rev-12",
    "bikeId": "bk-04",
    "customerId": "usr-c05",
    "customerName": "Tanmay Shinde",
    "rating": 4,
    "date": "2026-11-17",
    "comment": "Ola S1 Pro party speakers are fun! Fast pickup and good range across Hinjewadi Phase 1 & 2."
  },
  {
    "id": "rev-13",
    "bikeId": "bk-13",
    "customerId": "usr-c06",
    "customerName": "Ananya Dixit",
    "rating": 5,
    "date": "2026-11-18",
    "comment": "Hunter 350 is super easy to handle compared to heavier Bullets. Great for city riding."
  },
  {
    "id": "rev-14",
    "bikeId": "bk-15",
    "customerId": "usr-c13",
    "customerName": "Siddharth Chitre",
    "rating": 5,
    "date": "2026-11-15",
    "comment": "Apache RTR 160 4V engine sound is pure bliss. Very smooth gear shifts."
  },
  {
    "id": "rev-15",
    "bikeId": "bk-16",
    "customerId": "usr-c14",
    "customerName": "Shruti Kamble",
    "rating": 5,
    "date": "2026-11-19",
    "comment": "Bajaj Chetak solid steel body feels very safe. Battery lasted more than 110 km comfortably."
  },
  {
    "id": "rev-16",
    "bikeId": "bk-09",
    "customerId": "usr-c08",
    "customerName": "Pranali Gaikwad",
    "rating": 5,
    "date": "2026-11-17",
    "comment": "Revolt RV400 futuristic feel! People turned heads at traffic signals."
  },
  {
    "id": "rev-17",
    "bikeId": "bk-12",
    "customerId": "usr-c19",
    "customerName": "Gaurav Kadam",
    "rating": 4,
    "date": "2026-11-18",
    "comment": "Honda Shine gives smooth ride and zero fatigue during long traffic delays."
  },
  {
    "id": "rev-18",
    "bikeId": "bk-17",
    "customerId": "usr-c20",
    "customerName": "Sayali Salunkhe",
    "rating": 5,
    "date": "2026-11-16",
    "comment": "RayZR is so lightweight! Easy to mount on double stand and quick acceleration."
  },
  {
    "id": "rev-19",
    "bikeId": "bk-19",
    "customerId": "usr-c16",
    "customerName": "Divya Nimbalkar",
    "rating": 5,
    "date": "2026-11-15",
    "comment": "Pleasure Plus seat height was perfect for me. The backrest is very comfortable for the pillion."
  },
  {
    "id": "rev-20",
    "bikeId": "bk-20",
    "customerId": "usr-c10",
    "customerName": "Kavita Thorat",
    "rating": 5,
    "date": "2026-11-14",
    "comment": "Avenger 220 highway posture is royal. Great low seat and windshield blocked evening wind."
  }
];

  const SEED_NOTIFICATIONS = [
  {
    "id": "notif-01",
    "userId": "usr-c01",
    "title": "Active Ride in Progress",
    "message": "Your ride with Honda Activa 6G is ongoing. Return is scheduled for tomorrow 9:00 AM.",
    "time": "1 hour ago",
    "type": "primary",
    "icon": "bi-bicycle",
    "read": false
  },
  {
    "id": "notif-02",
    "userId": "usr-c01",
    "title": "Safety Deposit Safe",
    "message": "Your ₹500 safety deposit is secured and will be returned to your UPI immediately upon return.",
    "time": "2 hours ago",
    "type": "success",
    "icon": "bi-shield-check",
    "read": false
  },
  {
    "id": "notif-03",
    "userId": "usr-o01",
    "title": "New Booking Active",
    "message": "Rahul Patil has checked in with your Honda Activa 6G. Happy renting!",
    "time": "1 hour ago",
    "type": "info",
    "icon": "bi-check2-circle",
    "read": false
  },
  {
    "id": "notif-04",
    "userId": "usr-o05",
    "title": "New Booking Request",
    "message": "Pooja Kulkarni has requested your Ather 450X Gen 3 for Nov 24-26. Please accept or reject.",
    "time": "30 mins ago",
    "type": "warning",
    "icon": "bi-bell-fill",
    "read": false
  },
  {
    "id": "notif-05",
    "userId": "usr-c02",
    "title": "Request Sent to Owner",
    "message": "Your booking request for Ather 450X was sent to Sachin Pawar. You will receive an update soon.",
    "time": "30 mins ago",
    "type": "info",
    "icon": "bi-send",
    "read": false
  },
  {
    "id": "notif-06",
    "userId": "usr-c05",
    "title": "Owner Accepted Your Booking",
    "message": "Mahesh Patil has accepted your booking for Ola S1 Pro. Keep your driving licence ready.",
    "time": "2 hours ago",
    "type": "success",
    "icon": "bi-check-circle-fill",
    "read": false
  },
  {
    "id": "notif-07",
    "userId": "usr-o01",
    "title": "Monthly Earnings Summary",
    "message": "You have earned ₹42,500 so far this month from 14 completed rentals across Pune.",
    "time": "Yesterday",
    "type": "success",
    "icon": "bi-wallet2",
    "read": true
  },
  {
    "id": "notif-08",
    "userId": "usr-c03",
    "title": "Upcoming Booking Reminder",
    "message": "Your ride with Royal Enfield Classic 350 starts on Nov 23 at 8:00 AM. Location: Deccan Gymkhana.",
    "time": "Yesterday",
    "type": "info",
    "icon": "bi-calendar-event",
    "read": true
  },
  {
    "id": "notif-09",
    "userId": "usr-admin-01",
    "title": "Platform Health Good",
    "message": "22 active bikes listed, 20 bookings recorded, 0 pending customer disputes.",
    "time": "1 day ago",
    "type": "primary",
    "icon": "bi-graph-up-arrow",
    "read": true
  },
  {
    "id": "notif-10",
    "userId": "usr-admin-01",
    "title": "New Owner Verification",
    "message": "Owner Rajesh Gaikwad uploaded verified Aadhaar. Listing approved.",
    "time": "2 days ago",
    "type": "success",
    "icon": "bi-person-check",
    "read": true
  },
  {
    "id": "notif-11",
    "userId": "usr-c08",
    "title": "Booking Confirmed",
    "message": "Revolt RV400 booking confirmed for Nov 28. Free doorstep delivery to Magarpatta City.",
    "time": "3 hours ago",
    "type": "success",
    "icon": "bi-patch-check",
    "read": false
  },
  {
    "id": "notif-12",
    "userId": "usr-o09",
    "title": "Booking Confirmed on Your Bike",
    "message": "Pranali Gaikwad's booking on your Revolt RV400 is confirmed. Scheduled payout: ₹673.",
    "time": "3 hours ago",
    "type": "info",
    "icon": "bi-cash",
    "read": false
  },
  {
    "id": "notif-13",
    "userId": "usr-c16",
    "title": "Refund Processed",
    "message": "₹1,200 safety deposit for Bajaj Avenger booking BK-75090 has been refunded to your Google Pay.",
    "time": "1 day ago",
    "type": "success",
    "icon": "bi-arrow-counterclockwise",
    "read": true
  },
  {
    "id": "notif-14",
    "userId": "usr-c01",
    "title": "Past Ride Feedback",
    "message": "Thank you for rating Suzuki Access 125 5 stars! Suresh Deshmukh appreciated your review.",
    "time": "2 weeks ago",
    "type": "info",
    "icon": "bi-star-fill",
    "read": true
  },
  {
    "id": "notif-15",
    "userId": "usr-o02",
    "title": "Verified Owner Status Active",
    "message": "Congratulations! Your profile has maintained a 4.8+ rating and Verified Badge in Pune.",
    "time": "3 days ago",
    "type": "success",
    "icon": "bi-award-fill",
    "read": true
  }
];

  function getLocal(key, defaultVal = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn('Error reading ' + key + ':', e);
      return defaultVal;
    }
  }

  function setLocal(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error('Error saving ' + key + ':', e);
      return false;
    }
  }

  return {
    async init() {
      // 1. Load BIKES
      let bikes = getLocal(KEYS.BIKES);
      if (!bikes || bikes.length === 0) {
        bikes = JSON.parse(JSON.stringify(SEED_BIKES));
        setLocal(KEYS.BIKES, bikes);
      }

      // 2. Load USERS
      let users = getLocal(KEYS.USERS);
      if (!users || users.length === 0) {
        users = JSON.parse(JSON.stringify(SEED_USERS));
        setLocal(KEYS.USERS, users);
      }

      // 3. Current User (Guests must NOT be auto-logged in)
      let currentUser = getLocal(KEYS.CURRENT_USER, null);
      if (currentUser && users && users.length > 0) {
        const userExists = users.find(u => u.id === currentUser.id);
        if (!userExists || userExists.status === 'suspended') {
          currentUser = null;
          localStorage.removeItem(KEYS.CURRENT_USER);
        }
      }

      // 4. BOOKINGS
      let bookings = getLocal(KEYS.BOOKINGS);
      if (!bookings || bookings.length === 0) {
        bookings = JSON.parse(JSON.stringify(SEED_BOOKINGS));
        setLocal(KEYS.BOOKINGS, bookings);
      }

      // 5. REVIEWS
      let reviews = getLocal(KEYS.REVIEWS);
      if (!reviews || reviews.length === 0) {
        reviews = JSON.parse(JSON.stringify(SEED_REVIEWS));
        setLocal(KEYS.REVIEWS, reviews);
      }

      // 6. NOTIFICATIONS
      let notifications = getLocal(KEYS.NOTIFICATIONS);
      if (!notifications || notifications.length === 0) {
        notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
        setLocal(KEYS.NOTIFICATIONS, notifications);
      }

      // 7. WISHLIST & COMPARE defaults
      if (!getLocal(KEYS.WISHLIST)) setLocal(KEYS.WISHLIST, ["bk-01", "bk-03"]);
      if (!getLocal(KEYS.COMPARE)) setLocal(KEYS.COMPARE, ["bk-01", "bk-07"]);

      console.log('PedalPal Storage ready. Total bikes:', bikes.length, 'Total bookings:', bookings.length);
      return true;
    },

    // BIKES API
    getBikes(filters = {}) {
      let list = getLocal(KEYS.BIKES, []);
      if (!filters) return list;

      return list.filter(bike => {
        // Only approved bikes shown to customer
        if (filters.onlyApproved && !bike.isApproved) return false;

        // Search query (keyword)
        if (filters.search && filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchName = bike.name.toLowerCase().includes(q);
          const matchBrand = bike.brand.toLowerCase().includes(q);
          const matchLoc = bike.location.toLowerCase().includes(q);
          const matchCat = bike.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchLoc && !matchCat) return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
          if (bike.category !== filters.category) return false;
        }

        // Fuel Type
        if (filters.fuel && filters.fuel !== 'all') {
          if (bike.fuelType.toLowerCase() !== filters.fuel.toLowerCase()) return false;
        }

        // Transmission
        if (filters.transmission && filters.transmission !== 'all') {
          if (bike.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
        }

        // Location / Pune Area
        if (filters.location && filters.location !== 'all' && filters.location.trim()) {
          const loc = filters.location.toLowerCase().trim();
          if (!bike.location.toLowerCase().includes(loc)) return false;
        }

        // Price Max Filter
        if (filters.maxPrice) {
          if (bike.pricePerDay > Number(filters.maxPrice)) return false;
        }

        // Availability
        if (filters.availability && filters.availability !== 'all') {
          const mustBeAvail = filters.availability === 'available';
          if (bike.isAvailable !== mustBeAvail) return false;
        }

        // Owner ID filter
        if (filters.ownerId) {
          if (bike.ownerId !== filters.ownerId) return false;
        }

        return true;
      });
    },

    getBikeById(id) {
      const list = getLocal(KEYS.BIKES, []);
      return list.find(b => b.id === id) || null;
    },

    saveBike(bikeData) {
      const list = getLocal(KEYS.BIKES, []);
      const idx = list.findIndex(b => b.id === bikeData.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...bikeData };
      } else {
        bikeData.id = bikeData.id || 'bk-' + Date.now().toString().slice(-4);
        bikeData.totalTrips = 0;
        bikeData.reviewCount = 0;
        bikeData.rating = 5.0;
        bikeData.isApproved = true;
        bikeData.isAvailable = true;
        list.unshift(bikeData);
      }
      setLocal(KEYS.BIKES, list);
      return bikeData;
    },

    deleteBike(id) {
      let list = getLocal(KEYS.BIKES, []);
      list = list.filter(b => b.id !== id);
      setLocal(KEYS.BIKES, list);
      return true;
    },

    toggleBikeAvailability(id) {
      const list = getLocal(KEYS.BIKES, []);
      const bike = list.find(b => b.id === id);
      if (bike) {
        bike.isAvailable = !bike.isAvailable;
        setLocal(KEYS.BIKES, list);
        return bike.isAvailable;
      }
      return false;
    },

    toggleBikeApproval(id) {
      const list = getLocal(KEYS.BIKES, []);
      const bike = list.find(b => b.id === id);
      if (bike) {
        bike.isApproved = !bike.isApproved;
        setLocal(KEYS.BIKES, list);
        return bike.isApproved;
      }
      return false;
    },

    // USERS & AUTH API
    getUsers() {
      return getLocal(KEYS.USERS, []);
    },

    getUserById(id) {
      const users = this.getUsers();
      return users.find(u => u.id === id) || null;
    },

    getCurrentUser() {
      return getLocal(KEYS.CURRENT_USER, null);
    },

    setCurrentUser(user) {
      if (!user) {
        localStorage.removeItem(KEYS.CURRENT_USER);
      } else {
        setLocal(KEYS.CURRENT_USER, user);
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('pedalpal_user_changed', { detail: user }));
      }
      return user;
    },

    switchDemoUser(role) {
      const users = this.getUsers();
      const user = users.find(u => u.role === role);
      if (user) {
        return this.setCurrentUser(user);
      }
      return null;
    },

    saveUser(userData) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...userData };
      } else {
        userData.id = userData.id || 'usr-' + Date.now().toString().slice(-4);
        users.push(userData);
      }
      setLocal(KEYS.USERS, users);
      // If current user updated
      const cur = this.getCurrentUser();
      if (cur && cur.id === userData.id) {
        this.setCurrentUser(users[idx >= 0 ? idx : users.length - 1]);
      }
      return userData;
    },

    toggleUserStatus(id) {
      const users = this.getUsers();
      const user = users.find(u => u.id === id);
      if (user) {
        user.status = user.status === 'active' ? 'suspended' : 'active';
        setLocal(KEYS.USERS, users);
        return user.status;
      }
      return null;
    },

    toggleOwnerVerification(id) {
      const users = this.getUsers();
      const user = users.find(u => u.id === id && u.role === 'owner');
      if (user) {
        user.isVerified = !user.isVerified;
        user.badge = user.isVerified ? "Verified Owner" : "Pending Verification";
        setLocal(KEYS.USERS, users);
        return user.isVerified;
      }
      return null;
    },

    // BOOKINGS API
    getBookings(filter = {}) {
      let list = getLocal(KEYS.BOOKINGS, []);
      if (filter.customerId) {
        list = list.filter(b => b.customerId === filter.customerId);
      }
      if (filter.ownerId) {
        list = list.filter(b => b.ownerId === filter.ownerId);
      }
      if (filter.status && filter.status !== 'all') {
        list = list.filter(b => b.bookingStatus.toLowerCase() === filter.status.toLowerCase());
      }
      if (filter.bikeId) {
        list = list.filter(b => b.bikeId === filter.bikeId);
      }
      return list;
    },

    getBookingById(id) {
      const list = getLocal(KEYS.BOOKINGS, []);
      return list.find(b => b.id === id || b.bookingReference === id) || null;
    },

    /**
     * Temporal Collision Detection:
     * Checks if the requested booking dates overlap with an already confirmed/active booking for the same bike.
     */
    checkBookingCollision(bikeId, pickupDateStr, returnDateStr, excludeBookingId = null) {
      const bookings = this.getBookings({ bikeId });
      const newStart = new Date(pickupDateStr).getTime();
      const newEnd = new Date(returnDateStr).getTime();

      // Only active/confirmed states block the vehicle
      const blockingStatuses = ['Requested', 'Accepted', 'Confirmed', 'Ongoing'];

      for (const b of bookings) {
        if (excludeBookingId && b.id === excludeBookingId) continue;
        if (!blockingStatuses.includes(b.bookingStatus)) continue;

        const existStart = new Date(b.pickupDate).getTime();
        const existEnd = new Date(b.returnDate).getTime();

        // Overlap condition: (newStart < existEnd) and (newEnd > existStart)
        if (newStart < existEnd && newEnd > existStart) {
          return {
            hasCollision: true,
            conflictingBooking: b,
            message: `This bike is already booked from ${b.pickupDate.replace('T', ' ')} to ${b.returnDate.replace('T', ' ')}.`
          };
        }
      }

      return { hasCollision: false };
    },

    createBooking(bookingData) {
      const list = getLocal(KEYS.BOOKINGS, []);
      bookingData.id = bookingData.id || 'BK-' + Math.floor(10000 + Math.random() * 90000);
      bookingData.bookingReference = bookingData.id;
      bookingData.createdAt = new Date().toISOString();
      list.unshift(bookingData);
      setLocal(KEYS.BOOKINGS, list);

      // Create owner notification
      this.addNotification({
        userId: bookingData.ownerId,
        title: "New Booking Request",
        message: `${bookingData.customerName} has booked your ${bookingData.bikeName}. Please review and accept.`,
        type: "warning",
        icon: "bi-calendar-check"
      });

      // Create customer notification
      this.addNotification({
        userId: bookingData.customerId,
        title: "Booking Submitted",
        message: `Your booking for ${bookingData.bikeName} (${bookingData.id}) has been sent to the owner.`,
        type: "info",
        icon: "bi-send-check"
      });

      return bookingData;
    },

    updateBookingStatus(id, newStatus) {
      const list = getLocal(KEYS.BOOKINGS, []);
      const booking = list.find(b => b.id === id || b.bookingReference === id);
      if (!booking) return null;

      booking.bookingStatus = newStatus;
      booking.updatedAt = new Date().toISOString();

      if (newStatus === 'Accepted') {
        booking.paymentStatus = 'Paid';
        this.addNotification({
          userId: booking.customerId,
          title: "Booking Accepted!",
          message: `Owner ${booking.ownerName} has accepted your rental for ${booking.bikeName}. Get ready to ride!`,
          type: "success",
          icon: "bi-check-circle-fill"
        });
      } else if (newStatus === 'Rejected') {
        booking.paymentStatus = 'Refunded';
        this.addNotification({
          userId: booking.customerId,
          title: "Booking Declined",
          message: `The owner was unable to accept your booking for ${booking.bikeName}. Your safety deposit is fully refunded.`,
          type: "danger",
          icon: "bi-x-circle-fill"
        });
      } else if (newStatus === 'Cancelled') {
        booking.paymentStatus = 'Refunded';
        this.addNotification({
          userId: booking.ownerId,
          title: "Booking Cancelled",
          message: `Booking ${booking.id} was cancelled by the customer.`,
          type: "info",
          icon: "bi-info-circle"
        });
      } else if (newStatus === 'Completed') {
        this.addNotification({
          userId: booking.customerId,
          title: "Ride Completed",
          message: `Hope you enjoyed your ride on ${booking.bikeName}! ₹${booking.securityDeposit} deposit refunded.`,
          type: "success",
          icon: "bi-cash-coin"
        });
      }

      setLocal(KEYS.BOOKINGS, list);
      return booking;
    },

    // WISHLIST API
    getWishlist() {
      return getLocal(KEYS.WISHLIST, []);
    },

    toggleWishlist(bikeId) {
      let list = this.getWishlist();
      const idx = list.indexOf(bikeId);
      let isSaved = false;
      if (idx >= 0) {
        list.splice(idx, 1);
        isSaved = false;
      } else {
        list.push(bikeId);
        isSaved = true;
      }
      setLocal(KEYS.WISHLIST, list);
      return isSaved;
    },

    isInWishlist(bikeId) {
      return this.getWishlist().includes(bikeId);
    },

    // COMPARE API (Max 3 bikes)
    getCompareList() {
      return getLocal(KEYS.COMPARE, []);
    },

    addToCompare(bikeId) {
      let list = this.getCompareList();
      if (list.includes(bikeId)) return { success: true, count: list.length };
      if (list.length >= 3) {
        return { success: false, message: "You can compare up to 3 bikes at a time. Remove one first." };
      }
      list.push(bikeId);
      setLocal(KEYS.COMPARE, list);
      return { success: true, count: list.length };
    },

    removeFromCompare(bikeId) {
      let list = this.getCompareList();
      list = list.filter(id => id !== bikeId);
      setLocal(KEYS.COMPARE, list);
      return list;
    },

    // REVIEWS API
    getReviews(bikeId = null) {
      let list = getLocal(KEYS.REVIEWS, []);
      if (bikeId) {
        list = list.filter(r => r.bikeId === bikeId);
      }
      return list;
    },

    addReview(review) {
      const list = getLocal(KEYS.REVIEWS, []);
      review.id = 'rev-' + Date.now();
      review.date = new Date().toISOString().split('T')[0];
      list.unshift(review);
      setLocal(KEYS.REVIEWS, list);

      // Recalculate bike rating
      const bikeReviews = list.filter(r => r.bikeId === review.bikeId);
      const avg = bikeReviews.reduce((sum, r) => sum + r.rating, 0) / bikeReviews.length;
      const bike = this.getBikeById(review.bikeId);
      if (bike) {
        bike.rating = Number(avg.toFixed(1));
        bike.reviewCount = bikeReviews.length;
        this.saveBike(bike);
      }

      return review;
    },

    // NOTIFICATIONS API
    getNotifications(userId = null) {
      let list = getLocal(KEYS.NOTIFICATIONS, []);
      if (userId) {
        list = list.filter(n => !n.userId || n.userId === userId);
      }
      return list;
    },

    getUnreadNotifCount(userId = null) {
      const notifs = this.getNotifications(userId);
      return notifs.filter(n => !n.read).length;
    },

    markAllNotificationsRead(userId = null) {
      const list = getLocal(KEYS.NOTIFICATIONS, []);
      list.forEach(n => {
        if (!userId || n.userId === userId) {
          n.read = true;
        }
      });
      setLocal(KEYS.NOTIFICATIONS, list);
      return true;
    },

    addNotification(notif) {
      const list = getLocal(KEYS.NOTIFICATIONS, []);
      const newNotif = {
        id: 'notif-' + Date.now(),
        time: 'Just now',
        read: false,
        type: 'info',
        icon: 'bi-bell-fill',
        ...notif
      };
      list.unshift(newNotif);
      setLocal(KEYS.NOTIFICATIONS, list);
      return newNotif;
    },

    // RESET DEMO DATA
    async resetDemoData() {
      setLocal(KEYS.BIKES, JSON.parse(JSON.stringify(SEED_BIKES)));
      setLocal(KEYS.USERS, JSON.parse(JSON.stringify(SEED_USERS)));
      setLocal(KEYS.BOOKINGS, JSON.parse(JSON.stringify(SEED_BOOKINGS)));
      setLocal(KEYS.REVIEWS, JSON.parse(JSON.stringify(SEED_REVIEWS)));
      setLocal(KEYS.NOTIFICATIONS, JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)));
      setLocal(KEYS.WISHLIST, ["bk-01", "bk-03"]);
      setLocal(KEYS.COMPARE, ["bk-01", "bk-07"]);
      localStorage.removeItem(KEYS.CURRENT_USER);
      console.log('PedalPal demo database reset to factory state.');
      return true;
    }
  };
})();

if (typeof window !== 'undefined') {
  window.PedalPalStorage = Storage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}

