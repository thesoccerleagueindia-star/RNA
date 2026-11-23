/**
 * Browser Supabase inserts — primary path for static Hostinger hosting.
 * Uses publishable key + PostgREST (no Node /api required).
 */
(() => {
  const FEE = 3850;
  const RAZORPAY_ME =
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D";

  function cfg() {
    return window.RNA_CONFIG || {};
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }

  async function supabaseInsert(table, row) {
    const { supabaseUrl, supabasePublishableKey } = cfg();
    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error("Missing supabaseUrl / supabasePublishableKey in config.js");
    }
    const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }
    if (!res.ok) {
      const msg =
        json?.message ||
        json?.error_description ||
        json?.error ||
        text ||
        `HTTP ${res.status}`;
      const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      err.code = json?.code;
      err.status = res.status;
      throw err;
    }
    return Array.isArray(json) ? json[0] : json;
  }

  window.RNA_SUPABASE = {
    configured() {
      const c = cfg();
      return Boolean(c.supabaseUrl && c.supabasePublishableKey);
    },
    async insertWaitlist(data) {
      const id = makeId("WL");
      const submitted_at = new Date().toISOString();
      await supabaseInsert("waitlist", {
        id,
        submitted_at,
        player_name: data.playerName,
        guardian_name: data.guardianName,
        age: String(data.age || ""),
        city: data.city,
        category: data.category || "",
        interest: data.interest || "",
        email: data.email,
        phone: data.phone || "",
        consent: Boolean(data.consent),
      });
      return { id, submitted_at };
    },
    async insertRegistration(data) {
      const id = makeId("REG");
      const submitted_at = new Date().toISOString();
      const c = cfg();
      const paymentUrl = c.razorpayMeUrl || RAZORPAY_ME;
      const feePayable = c.feeInr || FEE;
      await supabaseInsert("registrations", {
        id,
        submitted_at,
        player_name: data.playerName,
        guardian_name: data.guardianName,
        age: String(data.age || ""),
        city: data.city,
        category: data.category || "",
        interest: data.interest || "",
        email: data.email,
        guardian_contact: data.guardianContact || "",
        fee_payable: feePayable,
        fee_note: "inclusive of GST",
        payment_status: "unpaid",
        payment_provider: "razorpay.me",
        payment_url: paymentUrl,
        razorpay_payment_link_id: "",
        guardian_consent: Boolean(data.guardianConsent),
        privacy_ack: Boolean(data.privacyAck),
      });
      return { id, submitted_at, paymentUrl, feePayable };
    },
  };
})();
