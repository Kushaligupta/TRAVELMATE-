export const translations = {
  en: {
    // Navbar
    login: "Login / Sign Up",
    logout: "Logout",

    // Dashboard tabs
    overview: "Overview",
    itinerary: "Itinerary",
    bookings: "Bookings",
    expenses: "Expenses",
    alerts: "Alerts",
    nearby: "Nearby",
    offline: "Offline",
    safety: "Safety",
    favorites: "Favorites",

    // Overview
    welcomeBack: "Welcome back",
    overviewSubtitle: "Here's an overview of your travel activity",
    totalTrips: "Total Trips",
    upcoming: "upcoming",
    totalExpenses: "Total Expenses",
    transactions: "transactions",
    activeAlerts: "Active Alerts",
    allClear: "All clear!",
    needsAttention: "Needs attention",
    recentTrips: "Recent Trips",
    noTripsYet: "No trips planned yet",
    profilePreferences: "Profile & Preferences",

    // Itinerary
    smartItineraryPlanner: "Smart Itinerary Planner",
    planYourTrips: "Plan your trips with transport, accommodation, and activities",
    addNewTrip: "Add New Trip",
    destination: "Destination",
    startDate: "Start Date",
    endDate: "End Date",
    addTrip: "Add Trip",
    yourTrips: "Your Trips",
    selectTrip: "Select a trip to view and edit details",
    tripDetails: "Trip Details",
    addSegment: "Add Segment",

    // Bookings
    seamlessBooking: "Seamless Booking",
    searchAndBook: "Search and book flights, trains, buses, hotels, and cabs",
    search: "Search",
    searchResults: "Search Results",
    optionsFound: "options found",
    bookAndSave: "Book & Save",
    yourConfirmations: "Your Confirmations",

    // Expenses
    expenseTracking: "Expense Tracking",
    trackSpending: "Track spending and split costs with travel companions",
    addExpense: "Add Expense",
    allExpenses: "All Expenses",
    groupSplit: "Group Split",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    close: "Close",
    loading: "Loading...",
    noData: "No data available",
  },
  hi: {
    // Navbar
    login: "लॉगिन / साइन अप",
    logout: "लॉगआउट",

    // Dashboard tabs
    overview: "अवलोकन",
    itinerary: "यात्रा कार्यक्रम",
    bookings: "बुकिंग",
    expenses: "खर्च",
    alerts: "अलर्ट",
    nearby: "आस-पास",
    offline: "ऑफ़लाइन",
    safety: "सुरक्षा",
    favorites: "पसंदीदा",

    // Overview
    welcomeBack: "वापसी पर स्वागत है",
    overviewSubtitle: "यहाँ आपकी यात्रा गतिविधि का अवलोकन है",
    totalTrips: "कुल यात्राएं",
    upcoming: "आगामी",
    totalExpenses: "कुल खर्च",
    transactions: "लेनदेन",
    activeAlerts: "सक्रिय अलर्ट",
    allClear: "सब ठीक है!",
    needsAttention: "ध्यान देने की जरूरत",
    recentTrips: "हाल की यात्राएं",
    noTripsYet: "अभी तक कोई यात्रा नियोजित नहीं",
    profilePreferences: "प्रोफ़ाइल और प्राथमिकताएं",

    // Itinerary
    smartItineraryPlanner: "स्मार्ट यात्रा योजनाकार",
    planYourTrips: "परिवहन, आवास और गतिविधियों के साथ अपनी यात्राएं प्लान करें",
    addNewTrip: "नई यात्रा जोड़ें",
    destination: "गंतव्य",
    startDate: "प्रारंभ तिथि",
    endDate: "समाप्ति तिथि",
    addTrip: "यात्रा जोड़ें",
    yourTrips: "आपकी यात्राएं",
    selectTrip: "विवरण देखने के लिए यात्रा चुनें",
    tripDetails: "यात्रा विवरण",
    addSegment: "खंड जोड़ें",

    // Bookings
    seamlessBooking: "आसान बुकिंग",
    searchAndBook: "फ्लाइट, ट्रेन, बस, होटल और कैब खोजें और बुक करें",
    search: "खोजें",
    searchResults: "खोज परिणाम",
    optionsFound: "विकल्प मिले",
    bookAndSave: "बुक करें और सेव करें",
    yourConfirmations: "आपकी पुष्टि",

    // Expenses
    expenseTracking: "खर्च ट्रैकिंग",
    trackSpending: "खर्च ट्रैक करें और यात्रा साथियों के साथ बांटें",
    addExpense: "खर्च जोड़ें",
    allExpenses: "सभी खर्च",
    groupSplit: "समूह विभाजन",

    // Common
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    remove: "हटाएं",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    noData: "कोई डेटा उपलब्ध नहीं",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
