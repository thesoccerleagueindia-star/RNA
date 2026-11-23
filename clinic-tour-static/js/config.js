/**
 * Central event configuration — edit here; pages read from EVENT_CONFIG.
 * DEMO MODE: promo codes & payment are local-only unless you wire a real API.
 */
window.EVENT_CONFIG = {
  title: "Rafa Nadal Academy Clinic India Tour 2027",
  organiserLegalName: "ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD",
  organiserShort: "Atletas India",
  tagline: "Experience the Methodology. Train Like a Champion.",
  contact: {
    phone: "+918013166131",
    phoneDisplay: "+91 80131 66131",
    email: "CONTACT@AISEORG.INFO",
    web: "WWW.AISEORG.INFO",
    webUrl: "https://www.aiseorg.info",
  },
  feeInr: 4250,
  currency: "INR",
  capacityPerCityDefault: 300,
  paymentMode: "demo", // "demo" | "live" — live requires Razorpay keys + backend
  razorpay: {
    // Publishable key only in browser when live. Never put key_secret here.
    keyIdEnvPlaceholder: "RAZORPAY_KEY_ID",
    keySecretEnvPlaceholder: "RAZORPAY_KEY_SECRET", // server only
    createOrderApi: "/api/payments/create-order",
    verifyApi: "/api/payments/verify",
  },
  demoPromoCodes: [
    { code: "INAUGURAL10", type: "percent", value: 10, label: "10% inaugural discount", maxRedemptions: 100 },
    { code: "FLAT500", type: "flat", value: 500, label: "₹500 off", maxRedemptions: 50 },
    { code: "DEMO100", type: "percent", value: 100, label: "Demo zero-pay (testing only)", maxRedemptions: 999 },
  ],
  cities: [
    {
      id: "mumbai",
      name: "Mumbai",
      status: "registration_open",
      datesLabel: "4–6 February 2027",
      venue: "To be announced",
      capacity: 300,
      days: [
        { date: "2027-02-04", label: "4 Feb 2027", category: "Juniors" },
        { date: "2027-02-05", label: "5 Feb 2027", category: "Mid-level" },
        { date: "2027-02-06", label: "6 Feb 2027", category: "High Performance / Elite" },
      ],
    },
    {
      id: "bangalore",
      name: "Bangalore",
      status: "registration_open",
      datesLabel: "8–10 February 2027",
      venue: "To be announced",
      capacity: 300,
      days: [
        { date: "2027-02-08", label: "8 Feb 2027", category: "Juniors" },
        { date: "2027-02-09", label: "9 Feb 2027", category: "Mid-level" },
        { date: "2027-02-10", label: "10 Feb 2027", category: "High Performance / Elite" },
      ],
    },
    {
      id: "kolkata",
      name: "Kolkata",
      status: "waitlist",
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [],
    },
    {
      id: "chennai",
      name: "Chennai",
      status: "waitlist",
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [],
    },
    {
      id: "delhi",
      name: "Delhi",
      status: "waitlist",
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [],
    },
  ],
};

window.EVENT_UTILS = {
  formatInr(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  },
  applyPromo(fee, code) {
    const cfg = window.EVENT_CONFIG;
    const raw = String(code || "").trim().toUpperCase();
    if (!raw) return { ok: true, fee, discount: 0, promo: null, message: "" };
    const promo = cfg.demoPromoCodes.find((p) => p.code === raw);
    if (!promo) return { ok: false, fee, discount: 0, promo: null, message: "Invalid promo code" };
    let discount = 0;
    if (promo.type === "percent") discount = Math.round((fee * promo.value) / 100);
    if (promo.type === "flat") discount = promo.value;
    discount = Math.min(discount, fee);
    return {
      ok: true,
      fee: fee - discount,
      discount,
      promo,
      message: promo.label,
    };
  },
  storage: {
    keyRegs: "aise-clinic-tour-2027-registrations",
    keyWait: "aise-clinic-tour-2027-waitlist",
    keyPromo: "aise-clinic-tour-2027-promo-redemptions",
    read(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    },
    write(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  },
};
