/**
 * PedalPal Multilingual Engine (js/i18n.js)
 * Supports English (en), Hindi (hi), and Marathi (mr).
 * Pure self-contained frontend localization with embedded dictionaries.
 * 100% compatible with file:/// protocol, offline mode, and web servers.
 * Preserves user language preference in localStorage ('pedalpal_lang').
 */

const I18n = (function () {
  const STORAGE_KEY = 'pedalpal_lang';
  const DEFAULT_LANG = 'en';

  const DICTIONARIES = {
    en: {
  "app_name": "PedalPal",
  "tagline": "Your Ride. Your Way.",
  "listen": "Listen",
  "listening": "Reading...",
  "stop_listen": "Stop Voice",
  "call_us": "Call Us",
  "chat_us": "Chat with Us",
  "notifications": "Notifications",
  "no_notifications": "No new messages right now.",
  "mark_all_read": "Mark all as read",
  "nav_home": "Home",
  "nav_bikes": "Explore Bikes",
  "nav_how_it_works": "How It Works",
  "nav_why_us": "Why Choose Us",
  "nav_compare": "Compare",
  "nav_wishlist": "Wishlist",
  "nav_my_bookings": "My Bookings",
  "nav_dashboard": "Dashboard",
  "nav_owner_portal": "Owner Hub",
  "nav_admin_portal": "Admin Portal",
  "nav_login": "Login",
  "nav_register": "Sign Up",
  "nav_logout": "Logout",
  "nav_profile": "Profile",
  "hero_title": "Find Your Perfect Ride in Pune",
  "hero_subtitle": "Rent verified bikes and scooters with doorstep delivery, free sanitized helmets, and 100% refundable safety deposit.",
  "search_where_label": "Location in Pune",
  "search_where_placeholder": "e.g. Kothrud, Baner, Hinjewadi",
  "search_pickup_label": "Pickup Date & Time",
  "search_return_label": "Return Date & Time",
  "search_category_label": "Vehicle Category",
  "search_category_all": "All Two-Wheelers",
  "search_category_scooters": "Scooters (Activa, Jupiter)",
  "search_category_motorcycles": "Motorcycles (Classic 350, Pulsar)",
  "search_category_electric_scooters": "Electric Scooters (Ather, Ola)",
  "search_category_electric_bikes": "Electric Bikes (Revolt, Tork)",
  "search_btn": "Search Bikes",
  "section_popular_title": "Popular Bikes Ready for Rent",
  "section_popular_subtitle": "Top-rated two-wheelers serviced and verified by local Pune owners",
  "filter_all": "All",
  "filter_scooters": "Scooters",
  "filter_motorcycles": "Motorcycles",
  "filter_electric_scooters": "Electric Scooters",
  "filter_electric_bikes": "Electric Bikes",
  "per_day": "day",
  "per_hour": "hr",
  "view_details": "View Details",
  "book_now": "Book Now",
  "add_to_compare": "Compare",
  "safety_deposit_label": "Safety deposit (100% returned): ₹",
  "helmet_included": "Free Helmet Included",
  "door_delivery": "Doorstep Delivery",
  "steps_title": "How PedalPal Works in 3 Easy Steps",
  "step_1_title": "1. Choose Your Ride",
  "step_1_desc": "Browse verified bikes and scooters near you with upfront prices and no hidden fees.",
  "step_2_title": "2. Simple Booking & Pay",
  "step_2_desc": "Select dates, enter details, and complete your reservation with instant confirmation.",
  "step_3_title": "3. Delivery & Ride",
  "step_3_desc": "Get the vehicle delivered to your doorstep with a clean sanitized helmet and hit the road.",
  "why_title": "Why Pune Rides with PedalPal",
  "why_1_title": "Verified Local Owners",
  "why_1_desc": "Every bike owner is identity-checked with Aadhaar and police verification.",
  "why_2_title": "Free Sanitized Helmet",
  "why_2_desc": "Rider safety is paramount. Every two-wheeler comes with a clean, sanitized helmet.",
  "why_3_title": "100% Refundable Deposit",
  "why_3_desc": "Your safety deposit is sent straight back to your UPI or bank right after your ride.",
  "why_4_title": "24/7 Pune Roadside Support",
  "why_4_desc": "One-tap emergency SOS and mechanical assistance anywhere in Pune.",
  "footer_tagline": "Pune's smart and trusted two-wheeler rental platform.",
  "footer_rights": "© 2026 PedalPal. Academic College Project. All demonstration data fictional.",
  "login_title": "Welcome Back",
  "login_subtitle": "Sign in to book two-wheelers, manage your fleet, or view rental trips.",
  "login_with_password": "Password Login",
  "login_with_otp": "Login via OTP",
  "login_identifier_label": "Email Address or Mobile Number",
  "login_password_label": "Password",
  "remember_me": "Remember me on this browser",
  "forgot_link": "Forgot?",
  "sign_in_btn": "Sign In to PedalPal",
  "no_account_prompt": "Don't have an account yet?",
  "sign_up_free": "Sign Up Free",
  "mobile_number_label": "10-Digit Mobile Number",
  "send_otp_btn": "Send OTP Code",
  "enter_otp_label": "6-Digit Verification Code",
  "verify_otp_btn": "Verify & Sign In",
  "resend_otp": "Resend OTP",
  "forgot_modal_title": "Reset Your Account Password",
  "forgot_step1_help": "Enter your registered email address or 10-digit mobile number to receive a 6-digit reset code.",
  "send_reset_code_btn": "Send Reset Code",
  "reset_code_label": "6-Digit Reset Code",
  "new_password_label": "New Password (min 8 characters)",
  "confirm_password_label": "Confirm New Password",
  "update_password_btn": "Update Password & Sign In"
},
    hi: {
  "app_name": "पेडलपाल",
  "tagline": "आपकी सवारी। आपकी पसंद।",
  "listen": "सुनिए",
  "listening": "पढ़ रहे हैं...",
  "stop_listen": "आवाज़ रोकें",
  "call_us": "हमें कॉल करें",
  "chat_us": "हमसे चैट करें",
  "notifications": "सूचनाएं",
  "no_notifications": "अभी कोई नया संदेश नहीं है।",
  "mark_all_read": "सब पढ़ लिया",
  "nav_home": "होम",
  "nav_bikes": "गाड़ियाँ देखें",
  "nav_how_it_works": "कैसे काम करता है",
  "nav_why_us": "हमें क्यों चुनें",
  "nav_compare": "तुलना करें",
  "nav_wishlist": "पसंदीदा",
  "nav_my_bookings": "मेरी बुकिंग्स",
  "nav_dashboard": "डैशबोर्ड",
  "nav_owner_portal": "मालिक हब",
  "nav_admin_portal": "एडमिन पोर्टल",
  "nav_login": "लॉग इन",
  "nav_register": "साइन अप",
  "nav_logout": "लॉग आउट",
  "nav_profile": "प्रोफाइल",
  "hero_title": "पुणे में अपनी मनपसंद बाइक या स्कूटर खोजें",
  "hero_subtitle": "घर तक डिलीवरी, साफ सैनिटाइज्ड हेलमेट और 100% वापस मिलने वाली सुरक्षा राशि के साथ दोपहिया वाहन किराए पर लें।",
  "search_where_label": "पुणे में कहाँ चाहिए?",
  "search_where_placeholder": "जैसे: कोथरूड, बानेर, हिंजेवड़ी",
  "search_pickup_label": "लेने की तारीख और समय",
  "search_return_label": "वापसी की तारीख और समय",
  "search_category_label": "गाड़ी की श्रेणी",
  "search_category_all": "सभी दोपहिया",
  "search_category_scooters": "स्कूटर (एक्टिवा, जुपिटर)",
  "search_category_motorcycles": "मोटरसाइकिल (क्लासिक 350, पल्सर)",
  "search_category_electric_scooters": "इलेक्ट्रिक स्कूटर (एथर, ओला)",
  "search_category_electric_bikes": "इलेक्ट्रिक बाइक (रिवॉल्ट, टॉर्क)",
  "search_btn": "गाड़ी खोजें",
  "section_popular_title": "किराए के लिए तैयार लोकप्रिय गाड़ियां",
  "section_popular_subtitle": "पुणे के स्थानीय मालिकों द्वारा जाँची-परखी और सर्विस की हुई दोपहिया गाड़ियां",
  "filter_all": "सभी",
  "filter_scooters": "स्कूटर",
  "filter_motorcycles": "मोटरसाइकिल",
  "filter_electric_scooters": "इलेक्ट्रिक स्कूटर",
  "filter_electric_bikes": "इलेक्ट्रिक बाइक",
  "per_day": "दिन",
  "per_hour": "घंटा",
  "view_details": "विवरण देखें",
  "book_now": "अभी बुक करें",
  "add_to_compare": "तुलना करें",
  "safety_deposit_label": "सुरक्षा राशि (पूरी वापस मिलेगी): ₹",
  "helmet_included": "मुफ्त हेलमेट शामिल है",
  "door_delivery": "घर तक डिलीवरी",
  "steps_title": "गाड़ी लेना 3 आसान कदमों में",
  "step_1_title": "1. अपनी पसंदीदा गाड़ी चुनें",
  "step_1_desc": "बिना किसी छिपे खर्च के अपने नजदीकी इलाके में जाँची-परखी बाइक या स्कूटर चुनें।",
  "step_2_title": "2. आसान बुकिंग और भुगतान",
  "step_2_desc": "तारीखें चुनें, जरूरी जानकारी भरें और तुरंत पक्की बुकिंग पाएं।",
  "step_3_title": "3. घर पर गाड़ी पाएं और घूमें",
  "step_3_desc": "गाड़ी आपके घर तक पहुंचेगी, साफ हेलमेट के साथ। बेफिक्र घूमें!",
  "why_title": "पुणे के लोग पेडलपाल पर क्यों भरोसा करते हैं",
  "why_1_title": "जाँचे-परखे मालिक",
  "why_1_desc": "हर मालिक का आधार और पुलिस सत्यापन पूरा किया गया है।",
  "why_2_title": "साफ और स्वच्छ हेलमेट",
  "why_2_desc": "आपकी सुरक्षा सबसे पहले। हर दोपहिया के साथ एक सैनिटाइज्ड हेलमेट मुफ्त।",
  "why_3_title": "सुरक्षा राशि तुरंत वापस",
  "why_3_desc": "सवारी खत्म होते ही सुरक्षा राशि सीधे आपके यूपीआई या बैंक खाते में वापस।",
  "why_4_title": "24/7 सड़क पर आपातकालीन मदद",
  "why_4_desc": "पुणे में कहीं भी गाड़ी खराब होने पर तुरंत मैकेनिक सहायता।",
  "footer_tagline": "पुणे का सरल और भरोसेमंद दोपहिया किराया मंच।",
  "footer_rights": "© 2026 पेडलपाल। कॉलेज प्रोजेक्ट।",
  "login_title": "वापसी पर स्वागत है",
  "login_subtitle": "दोपहिया वाहन बुक करने, गाड़ियाँ प्रबंधित करने या ट्रिप्स देखने के लिए लॉगिन करें।",
  "login_with_password": "पासवर्ड लॉगिन",
  "login_with_otp": "ओटीपी द्वारा लॉगिन",
  "login_identifier_label": "ईमेल पता या मोबाइल नंबर",
  "login_password_label": "पासवर्ड",
  "remember_me": "इस ब्राउज़र पर मुझे याद रखें",
  "forgot_link": "भूल गए?",
  "sign_in_btn": "पेडलपाल में लॉगिन करें",
  "no_account_prompt": "क्या अभी तक आपका खाता नहीं है?",
  "sign_up_free": "मुफ्त साइन अप करें",
  "mobile_number_label": "१० अंकों का मोबाइल नंबर",
  "send_otp_btn": "ओटीपी कोड भेजें",
  "enter_otp_label": "६ अंकों का सत्यापन कोड",
  "verify_otp_btn": "सत्यापित करें और लॉगिन करें",
  "resend_otp": "दोबारा ओटीपी भेजें",
  "forgot_modal_title": "अपना पासवर्ड रीसेट करें",
  "forgot_step1_help": "६-अंकों का रीसेट कोड प्राप्त करने के लिए अपना पंजीकृत ईमेल या १०-अंकों का मोबाइल नंबर दर्ज करें।",
  "send_reset_code_btn": "रीसेट कोड भेजें",
  "reset_code_label": "६ अंकों का रीसेट कोड",
  "new_password_label": "नया पासवर्ड (कम से कम ८ अक्षर)",
  "confirm_password_label": "नए पासवर्ड की पुष्टि करें",
  "update_password_btn": "पासवर्ड बदलें और लॉगिन करें"
},
    mr: {
  "app_name": "पेडलपाल",
  "tagline": "तुमची गाडी। तुमची मर्जी।",
  "listen": "ऐका",
  "listening": "वाचत आहे...",
  "stop_listen": "आवाज थांबवा",
  "call_us": "आम्हाला फोन करा",
  "chat_us": "चॅट करा",
  "notifications": "सूचना",
  "no_notifications": "सध्या कोणताही नवीन संदेश नाही.",
  "mark_all_read": "सर्व वाचले",
  "nav_home": "मुख्य पान",
  "nav_bikes": "गाड्या शोधा",
  "nav_how_it_works": "कसे चालते",
  "nav_why_us": "आम्हाला का निवडावे",
  "nav_compare": "तुलना करा",
  "nav_wishlist": "आवडलेल्या गाड्या",
  "nav_my_bookings": "माझ्या बुकिंग्स",
  "nav_dashboard": "डॅशबोर्ड",
  "nav_owner_portal": "मालक कक्ष",
  "nav_admin_portal": "प्रशासक पोर्टल",
  "nav_login": "लॉग इन",
  "nav_register": "नोंदणी करा",
  "nav_logout": "लॉग आउट",
  "nav_profile": "माझी माहिती",
  "hero_title": "पुण्यात हवी ती बाईक किंवा स्कूटर भाड्याने घ्या",
  "hero_subtitle": "घरापर्यंत मोफत डिलिव्हरी, स्वच्छ निर्जंतुक हेल्मेट आणि १००% परत मिळणाऱ्या अनामत रकमेसह पुण्यात प्रवास करा.",
  "search_where_label": "पुण्यात कुठे हवी?",
  "search_where_placeholder": "उदा: कोथरूड, बाणेर, हिंजेवडी",
  "search_pickup_label": "गाडी घेण्याची तारीख व वेळ",
  "search_return_label": "गाडी परत करण्याची तारीख व वेळ",
  "search_category_label": "गाडीचा प्रकार",
  "search_category_all": "सर्व दुचाकी गाड्या",
  "search_category_scooters": "स्कूटर्स (ॲक्टिव्हा, ज्युपिटर)",
  "search_category_motorcycles": "मोटारसायकल (क्लासिक ३५०, पल्सर)",
  "search_category_electric_scooters": "इलेक्ट्रिक स्कूटर (एथर, ओला)",
  "search_category_electric_bikes": "इलेक्ट्रिक बाईक (रिव्हॉल्ट, टॉर्क)",
  "search_btn": "गाड्या शोधा",
  "section_popular_title": "भाड्यासाठी तयार लोकप्रिय गाड्या",
  "section_popular_subtitle": "पुण्यातील स्थानिक मालकांनी तपासलेल्या सुस्थितीतील दुचाकी",
  "filter_all": "सर्व",
  "filter_scooters": "स्कूटर्स",
  "filter_motorcycles": "मोटारसायकल",
  "filter_electric_scooters": "इलेक्ट्रिक स्कूटर्स",
  "filter_electric_bikes": "इलेक्ट्रिक बाईक्स",
  "per_day": "दिवस",
  "per_hour": "तास",
  "view_details": "तपशील पाहा",
  "book_now": "आत्ताच बुक करा",
  "add_to_compare": "तुलना करा",
  "safety_deposit_label": "सुरक्षा अनामत (पूर्ण परत मिळते): ₹",
  "helmet_included": "मोफत हेल्मेट मिळेल",
  "door_delivery": "दारात डिलिव्हरी",
  "steps_title": "गाडी भाड्याने घेणे ३ सोप्या पायऱ्यांत",
  "step_1_title": "१. आवडती गाडी निवडा",
  "step_1_desc": "कोणत्याही लपलेल्या शुल्काशिवाय जवळची खात्रीशीर गाडी निवडा.",
  "step_2_title": "२. साधी बुकिंग आणि पैसे भरा",
  "step_2_desc": "तारीख निवडा, आवश्यक माहिती भरा आणि तात्काळ बुकिंग मिळवा.",
  "step_3_title": "३. दारात गाडी घ्या आणि फिरा",
  "step_3_desc": "गाडी थेट तुमच्या घरासमोर येईल, स्वच्छ मोफत हेल्मेटसह.",
  "why_title": "पुणेकर पेडलपालवर का विश्वास ठेवतात",
  "why_1_title": "पडताळणी झालेले मालक",
  "why_1_desc": "प्रत्येक वाहन मालकाची आधार व पोलीस पडताळणी पूर्ण झालेली असते.",
  "why_2_title": "स्वच्छ व निर्जंतुक हेल्मेट",
  "why_2_desc": "तुमची सुरक्षा आमचे प्राधान्य. प्रत्येक दुचाकीसोबत एक स्वच्छ हेल्मेट मोफत.",
  "why_3_title": "अनामत रक्कम लगेच परत",
  "why_3_desc": "गाडी परत करताच तुमची अनामत रक्कम थेट तुमच्या खात्यावर जमा होते.",
  "why_4_title": "२४ तास रस्त्यावर मदत",
  "why_4_desc": "पुण्यात कुठेही रस्त्यावर गाडी बंद पडल्यास मेकॅनिक तात्काळ हजर.",
  "footer_tagline": "पुण्यासाठी सोपी आणि विश्वासू दुचाकी भाडे सेवा.",
  "footer_rights": "© २०२६ पेडलपाल. कॉलेज प्रोजेक्ट.",
  "login_title": "पुन्हा स्वागत आहे",
  "login_subtitle": "दुचाकी बुक करण्यासाठी, गाड्या व्यवस्थापित करण्यासाठी किंवा सहली पाहण्यासाठी लॉग इन करा.",
  "login_with_password": "पासवर्डने लॉगिन",
  "login_with_otp": "ओटीपीने लॉगिन",
  "login_identifier_label": "ईमेल पत्ता किंवा मोबाईल नंबर",
  "login_password_label": "पासवर्ड",
  "remember_me": "या ब्राउझरवर माझी नोंद ठेवा",
  "forgot_link": "विसरलात?",
  "sign_in_btn": "पेडलपालमध्ये लॉग इन करा",
  "no_account_prompt": "अजून खाते नाही का?",
  "sign_up_free": "मोफत नोंदणी करा",
  "mobile_number_label": "१० अंकी मोबाईल नंबर",
  "send_otp_btn": "ओटीपी कोड पाठवा",
  "enter_otp_label": "६ अंकी पडताळणी कोड",
  "verify_otp_btn": "पडताळणी करा आणि लॉगिन करा",
  "resend_otp": "पुन्हा ओटीपी पाठवा",
  "forgot_modal_title": "तुमचा पासवर्ड रीसेट करा",
  "forgot_step1_help": "६-अंकी रीसेट कोड मिळविण्यासाठी तुमचा नोंदणीकृत ईमेल किंवा १०-अंकी मोबाईल नंबर टाका.",
  "send_reset_code_btn": "रीसेट कोड पाठवा",
  "reset_code_label": "६ अंकी रीसेट कोड",
  "new_password_label": "नवीन पासवर्ड (किमान ८ अक्षरे)",
  "confirm_password_label": "नवीन पासवर्डची खात्री करा",
  "update_password_btn": "पासवर्ड बदला आणि लॉग इन करा"
}
  };

  let currentLang = (function() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved && DICTIONARIES[saved]) ? saved : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  })();

  function getDict(lang) {
    return DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG];
  }

  return {
    init() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && DICTIONARIES[saved]) currentLang = saved;
      } catch (e) {}
      this.updateDOM();
      this.updateActiveButton();
      return true;
    },

    setLanguage(lang) {
      if (!DICTIONARIES[lang]) lang = DEFAULT_LANG;
      currentLang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}
      this.updateDOM();
      this.updateActiveButton();
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('pedalpal_lang_changed', { detail: { lang } }));
      }
      return true;
    },

    getLanguage() {
      return currentLang;
    },

    t(key) {
      const dict = getDict(currentLang);
      const enDict = DICTIONARIES[DEFAULT_LANG];
      return dict[key] !== undefined ? dict[key] : (enDict[key] !== undefined ? enDict[key] : key);
    },

    updateDOM() {
      if (typeof document === 'undefined') return;
      const dict = getDict(currentLang);
      const enDict = DICTIONARIES[DEFAULT_LANG];

      // Update textContent for elements with data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = dict[key] !== undefined ? dict[key] : enDict[key];
        if (text !== undefined) {
          // If element has child elements with icons, preserve the icon
          const icon = el.querySelector('i');
          if (icon && el.childNodes.length > 1) {
            const isBefore = el.firstChild === icon || (el.childNodes[0].nodeType === 3 && el.childNodes[0].textContent.trim() === '');
            if (isBefore) {
              el.innerHTML = icon.outerHTML + ' ' + text;
            } else {
              el.innerHTML = text + ' ' + icon.outerHTML;
            }
          } else {
            el.textContent = text;
          }
        }
      });

      // Update placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = dict[key] !== undefined ? dict[key] : enDict[key];
        if (text !== undefined) el.setAttribute('placeholder', text);
      });

      // Update titles
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const text = dict[key] !== undefined ? dict[key] : enDict[key];
        if (text !== undefined) el.setAttribute('title', text);
      });
    },

    updateActiveButton() {
      if (typeof document === 'undefined') return;
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.classList.add('active');
          if (btn.classList.contains('dropdown-item')) {
            btn.classList.add('fw-bold', 'text-teal');
          }
        } else {
          btn.classList.remove('active');
          if (btn.classList.contains('dropdown-item')) {
            btn.classList.remove('fw-bold', 'text-teal');
          }
        }
      });
    }
  };
})();

if (typeof window !== 'undefined') {
  window.PedalPalI18n = I18n;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}

// Immediate sync initialization when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      I18n.init();
    });
  } else {
    I18n.init();
  }
}
