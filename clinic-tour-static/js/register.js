(() => {
  const cfg = window.EVENT_CONFIG;
  const utils = window.EVENT_UTILS;
  const form = document.querySelector("#reg-form");
  const payPanel = document.querySelector("#pay-panel");
  const statusEl = document.querySelector("#form-status");
  const feeBase = document.querySelector("#fee-base");
  const feeDiscount = document.querySelector("#fee-discount");
  const feeTotal = document.querySelector("#fee-total");
  const promoMsg = document.querySelector("#promo-msg");
  const stepForm = document.querySelector('[data-step="form"]');
  const stepPay = document.querySelector('[data-step="pay"]');
  const modeBadge = document.querySelector("#payment-mode-badge");

  if (!form) return;

  const params = new URLSearchParams(location.search);
  const citySelect = form.elements.city;
  const interestSelect = form.elements.interest;
  if (params.get("city") && citySelect) citySelect.value = params.get("city");
  if (params.get("interest") && interestSelect) interestSelect.value = params.get("interest");

  let draft = null;

  function refreshFee() {
    const promo = form.elements.promo?.value || "";
    const result = utils.applyPromo(cfg.feeInr, promo);
    if (feeBase) feeBase.textContent = utils.formatInr(cfg.feeInr);
    if (feeDiscount) feeDiscount.textContent = result.discount ? `−${utils.formatInr(result.discount)}` : "—";
    if (feeTotal) feeTotal.textContent = utils.formatInr(result.ok ? result.fee : cfg.feeInr);
    if (promoMsg) {
      promoMsg.textContent = result.message || (promo && !result.ok ? result.message : "");
      promoMsg.className = result.ok || !promo ? "hint success" : "hint error";
      if (!promo) promoMsg.className = "hint";
    }
    return result;
  }

  form.elements.promo?.addEventListener("input", refreshFee);
  document.querySelector("#apply-promo")?.addEventListener("click", (e) => {
    e.preventDefault();
    refreshFee();
  });
  refreshFee();

  if (modeBadge) {
    modeBadge.textContent =
      cfg.paymentMode === "live" ? "LIVE Razorpay (keys required)" : "DEMO MODE — no live charges";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "error";

    if (!form.checkValidity()) {
      statusEl.textContent = "Please complete required fields.";
      form.reportValidity();
      return;
    }

    if (form.elements.interest.value === "Clinic" && Number(form.elements.age.value) < 5) {
      statusEl.textContent = "Please enter a valid player age.";
      return;
    }

    const feeResult = refreshFee();
    if (form.elements.promo.value && !feeResult.ok) {
      statusEl.textContent = feeResult.message;
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    draft = {
      ...data,
      id: `REG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "pending_payment",
      pathway: data.interest,
      feeBase: cfg.feeInr,
      discount: feeResult.discount,
      feePayable: feeResult.fee,
      promoCode: feeResult.promo?.code || null,
      paymentMode: cfg.paymentMode,
      paymentStatus: "unpaid",
    };

    payPanel.hidden = false;
    form.hidden = true;
    stepForm?.classList.remove("active");
    stepForm?.classList.add("done");
    stepPay?.classList.add("active");
    document.querySelector("#pay-ref").textContent = draft.id;
    document.querySelector("#pay-summary").textContent =
      `${draft.playerName} · ${draft.city} · ${draft.interest} · ${utils.formatInr(draft.feePayable)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelector("#back-to-form")?.addEventListener("click", () => {
    payPanel.hidden = true;
    form.hidden = false;
    stepPay?.classList.remove("active");
    stepForm?.classList.add("active");
    stepForm?.classList.remove("done");
  });

  document.querySelector("#pay-demo")?.addEventListener("click", () => {
    if (!draft) return;
    completeRegistration(draft, {
      provider: "demo",
      paymentId: `demo_${Date.now()}`,
      note: "Demo payment — not a real charge",
    });
  });

  document.querySelector("#pay-razorpay")?.addEventListener("click", async () => {
    if (!draft) return;
    if (cfg.paymentMode !== "live") {
      statusEl.className = "error";
      statusEl.textContent =
        "Razorpay live mode is off. Set paymentMode to live and provide RAZORPAY_KEY_ID + server secret, or use Demo Pay.";
      statusEl.hidden = false;
      document.querySelector("#pay-status").textContent =
        "Live Razorpay not configured. Use Demo Pay on this static package, or deploy the Next.js app with env secrets.";
      return;
    }
    // Placeholder for host that injects window.RAZORPAY_KEY_ID and a create-order endpoint.
    document.querySelector("#pay-status").textContent =
      "Live flow: POST to create-order API, open Razorpay Checkout, then verify signature server-side. Hooks are documented in README.";
  });

  function completeRegistration(reg, payment) {
    const record = {
      ...reg,
      status: "confirmed",
      paymentStatus: "paid",
      payment,
      confirmedAt: new Date().toISOString(),
    };
    const regs = utils.storage.read(utils.storage.keyRegs);
    regs.push(record);
    utils.storage.write(utils.storage.keyRegs, regs);

    if (record.promoCode) {
      const redemptions = utils.storage.read(utils.storage.keyPromo);
      redemptions.push({
        code: record.promoCode,
        registrationId: record.id,
        discount: record.discount,
        feePayable: record.feePayable,
        at: record.confirmedAt,
        mode: record.paymentMode,
      });
      utils.storage.write(utils.storage.keyPromo, redemptions);
    }

    payPanel.innerHTML = `
      <div class="success">
        <h2 style="margin-top:0;font-family:var(--font-display);letter-spacing:0.04em;">Registration recorded (demo)</h2>
        <p>Reference <strong>${record.id}</strong></p>
        <p>${record.playerName} · ${record.city} · ${record.interest}</p>
        <p>Paid (demo): <strong>${utils.formatInr(record.feePayable)}</strong>${
          record.discount ? ` (discount ${utils.formatInr(record.discount)})` : ""
        }</p>
        <p class="hint">This static package stores data in your browser only. It does <strong>not</strong> charge a card. Deploy with Razorpay + server APIs for live payments.</p>
        <p><a class="btn btn-gold" href="index.html">Back to brochure</a>
        <a class="btn btn-navy" href="admin.html" style="margin-left:0.5rem">View in Admin (demo)</a></p>
      </div>`;
  }
})();
