export const eventConfig = {
  title: "Rafa Nadal Academy Clinic India Tour 2027",
  organiserLegalName: "ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD",
  tagline: "Experience the Methodology. Train Like a Champion.",
  contact: {
    phone: "+918013166131",
    phoneDisplay: "+91 80131 66131",
    email: "CONTACT@AISEORG.INFO",
    web: "WWW.AISEORG.INFO",
    webUrl: "https://www.aiseorg.info",
  },
  feeInr: 3850,
  feeInclusiveOfGst: true,
  feeNote: "inclusive of GST",
  currency: "INR",
  capacityPerCityDefault: 300,
  cities: [
    {
      id: "mumbai",
      name: "Mumbai",
      status: "registration_open" as const,
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
      status: "registration_open" as const,
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
      status: "waitlist" as const,
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [] as { date: string; label: string; category: string }[],
    },
    {
      id: "chennai",
      name: "Chennai",
      status: "waitlist" as const,
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [] as { date: string; label: string; category: string }[],
    },
    {
      id: "delhi",
      name: "Delhi",
      status: "waitlist" as const,
      datesLabel: "Late April–May 2027",
      venue: "Dates & venue TBA",
      capacity: 300,
      days: [] as { date: string; label: string; category: string }[],
    },
  ],
  /** Live Razorpay.me payment page for clinic fee (₹3,850). */
  razorpayMe: {
    fullFeeUrl:
      "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D",
    baseUrl: "https://razorpay.me/@rnaclinicindia2027",
    handle: "@rnaclinicindia2027",
  },
};

export function paymentMode(): "demo" | "live" {
  const mode = (process.env.PAYMENT_MODE || "demo").toLowerCase();
  return mode === "live" ? "live" : "demo";
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
