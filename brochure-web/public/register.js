(() => {
  const FEE = 3850;
  const FEE_LABEL = "inclusive of GST";
  const RAZORPAY_ME_FALLBACK =
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D";
  const KEY_REGS = "aise-clinic-tour-2027-registrations";

  const formatInr = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function rlsHint(msg) {
    if (/row-level security|42501/i.test(msg || "")) {
      return " Supabase RLS is blocking inserts — run supabase/fix-rls-for-public-forms.sql in the SQL Editor, then retry.";
    }
    return "";
  }

  const form = document.querySelector("#reg-form");
  const statusEl = document.querySelector("#form-status");
  const payBtnAmount = document.querySelector("#pay-btn-amount");
  const feeTotal = document.querySelector("#fee-total");

  if (payBtnAmount) payBtnAmount.textContent = formatInr(FEE);
  if (feeTotal) feeTotal.textContent = formatInr(FEE);

  const params = new URLSearchParams(location.search);
  const city = document.querySelector("#city");
  if (params.get("city") && city) city.value = params.get("city");
  if (params.get("interest")) {
    const interest = document.querySelector("#interest");
    if (interest) interest.value = params.get("interest");
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("error");

    if (!form.checkValidity()) {
      statusEl.textContent = "Please complete required fields.";
      statusEl.classList.add("error");
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.guardianConsent = Boolean(form.querySelector('[name="guardianConsent"]')?.checked);
    data.privacyAck = Boolean(form.querySelector('[name="privacyAck"]')?.checked);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    statusEl.textContent = "Submitting registration…";

    let record = {
      ...data,
      id: `REG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      feeBase: FEE,
      feePayable: FEE,
      feeNote: FEE_LABEL,
      status: "pending_payment",
      paymentStatus: "unpaid",
      paymentProvider: "razorpay.me",
      paymentUrl: RAZORPAY_ME_FALLBACK,
    };

    let stored = false;
    let lastErr = "";

    // 1) Primary: browser → Supabase
    try {
      if (!window.RNA_SUPABASE?.configured?.()) {
        throw new Error("Supabase config missing in config.js");
      }
      const r = await window.RNA_SUPABASE.insertRegistration(data);
      record = {
        ...record,
        id: r.id,
        paymentUrl: r.paymentUrl || RAZORPAY_ME_FALLBACK,
        feePayable: r.feePayable || FEE,
        source: "supabase-browser",
      };
      stored = true;
    } catch (err) {
      lastErr = String(err.message || err);
      // 2) Optional Node API
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.ok === false) {
          throw new Error(json.error || lastErr || `Server ${res.status}`);
        }
        record = {
          ...record,
          id: json.id || record.id,
          paymentUrl: json.paymentUrl || RAZORPAY_ME_FALLBACK,
          paymentProvider: json.paymentProvider || "razorpay.me",
          feePayable: json.feePayable || FEE,
          source: "api",
        };
        stored = true;
      } catch (err2) {
        lastErr = String(err2.message || err2 || lastErr);
        record.source = "localStorage-fallback";
        record.apiError = lastErr;
        statusEl.textContent = `Could not save to Supabase: ${lastErr}.${rlsHint(lastErr)} Opening Razorpay anyway — also email CONTACT@AISEORG.INFO.`;
        statusEl.classList.add("error");
      }
    }

    const regs = read(KEY_REGS);
    regs.push(record);
    write(KEY_REGS, regs);

    window.open(record.paymentUrl || RAZORPAY_ME_FALLBACK, "_blank", "noopener");

    form.hidden = true;
    const success = document.querySelector("#success-panel");
    success.hidden = false;
    document.querySelector("#success-body").innerHTML = `
      <p>Reference <strong>${record.id}</strong>${stored ? "" : " (local only — storage failed)"}</p>
      <p>${record.playerName} · ${record.city} · ${record.interest}</p>
      <p>Payable: <strong>${formatInr(record.feePayable || FEE)}</strong> <span class="tbc-note">(${FEE_LABEL})</span></p>
      <p>Complete payment on the Razorpay page that just opened.</p>
      <p style="margin-top:1rem">
        <a class="btn btn-green" href="${record.paymentUrl || RAZORPAY_ME_FALLBACK}" target="_blank" rel="noopener">Pay Now via Razorpay</a>
      </p>
      <p class="tbc-note">Keep your reference ID for confirmation with the organiser.</p>`;

    if (submitBtn) submitBtn.disabled = false;
  });
})();
