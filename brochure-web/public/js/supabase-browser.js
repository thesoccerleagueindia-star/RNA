/**
 * Browser Supabase insert helper (publishable key only).
 * Used as fallback when /api/* is unavailable, or as dual-path.
 */
(() => {
  const FEE = 3850;
  const RAZORPAY_ME =
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D";

  async function loadConfig() {
    if (window.RNA_CONFIG?.supabaseUrl && window.RNA_CONFIG?.supabasePublishableKey) {
      return window.RNA_CONFIG;
    }
    try {
      const res = await fetch("/api/public-config");
      if (res.ok) {
        const cfg = await res.json();
        window.RNA_CONFIG = { ...(window.RNA_CONFIG || {}), ...cfg };
        return window.RNA_CONFIG;
      }
    } catch {
      /* ignore */
    }
    return window.RNA_CONFIG || {};
  }

  async function supabaseInsert(table, row) {
    const cfg = await loadConfig();
    if (!cfg.supabaseUrl || !cfg.supabasePublishableKey) {
      throw new Error("Supabase publishable config missing");
    }
    const res = await fetch(`${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: cfg.supabasePublishableKey,
        Authorization: `Bearer ${cfg.supabasePublishableKey}`,
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
      const msg = json?.message || json?.error || text || `HTTP ${res.status}`;
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    return json;
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }

  window.RNA_SUPABASE = {
    loadConfig,
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
        category: data.category,
        interest: data.interest,
        email: data.email,
        phone: data.phone,
        consent: Boolean(data.consent),
      });
      return { id, submitted_at };
    },
    async insertRegistration(data) {
      const id = makeId("REG");
      const submitted_at = new Date().toISOString();
      const cfg = await loadConfig();
      const paymentUrl = cfg.razorpayMeUrl || RAZORPAY_ME;
      await supabaseInsert("registrations", {
        id,
        submitted_at,
        player_name: data.playerName,
        guardian_name: data.guardianName,
        age: String(data.age || ""),
        city: data.city,
        category: data.category,
        interest: data.interest,
        email: data.email,
        guardian_contact: data.guardianContact,
        fee_payable: cfg.feeInr || FEE,
        fee_note: "inclusive of GST",
        payment_status: "unpaid",
        payment_provider: "razorpay.me",
        payment_url: paymentUrl,
        razorpay_payment_link_id: "",
        guardian_consent: Boolean(data.guardianConsent),
        privacy_ack: Boolean(data.privacyAck),
      });
      return { id, submitted_at, paymentUrl, feePayable: cfg.feeInr || FEE };
    },
  };
})();
