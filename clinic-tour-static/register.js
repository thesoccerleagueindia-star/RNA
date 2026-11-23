(() => {
  const FEE = 4250;
  /** Live Razorpay.me Pay Now link (organiser payment page). */
  const RAZORPAY_PAY_URL =
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D";
  const PROMO = {
    code: "INAUGURAL10",
    type: "percent",
    value: 10,
    maxRedemptions: 40, // first 20–40 users; capped at 40
  };
  const KEY_REGS = "aise-clinic-tour-2027-registrations";
  const KEY_PROMO = "aise-clinic-tour-2027-promo-redemptions";

  const formatInr = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const form = document.querySelector("#reg-form");
  const promoInput = document.querySelector("#promo");
  const promoMsg = document.querySelector("#promo-msg");
  const feeDiscount = document.querySelector("#fee-discount");
  const feeTotal = document.querySelector("#fee-total");
  const feeStruck = document.querySelector("#fee-struck");
  const payBtnAmount = document.querySelector("#pay-btn-amount");
  const statusEl = document.querySelector("#form-status");

  let applied = { ok: true, discount: 0, fee: FEE, code: null, message: "" };

  function redemptionCount() {
    return read(KEY_PROMO).filter((r) => r.code === PROMO.code).length;
  }

  function calcPromo(raw) {
    const code = String(raw || "").trim().toUpperCase();
    if (!code) return { ok: true, discount: 0, fee: FEE, code: null, message: "Inaugural 10% for the first 40 confirmed registrations only." };
    if (code !== PROMO.code) return { ok: false, discount: 0, fee: FEE, code: null, message: "Invalid discount code." };
    const used = redemptionCount();
    if (used >= PROMO.maxRedemptions) {
      return { ok: false, discount: 0, fee: FEE, code: null, message: `Inaugural offer closed — ${PROMO.maxRedemptions} places already used.` };
    }
    const discount = Math.round((FEE * PROMO.value) / 100);
    const left = PROMO.maxRedemptions - used;
    return {
      ok: true,
      discount,
      fee: FEE - discount,
      code: PROMO.code,
      message: `10% inaugural discount applied · ${left} places left of ${PROMO.maxRedemptions}.`,
    };
  }

  function paint() {
    const raw = promoInput.value;
    applied = calcPromo(raw);
    feeDiscount.textContent = applied.discount ? `−${formatInr(applied.discount)}` : "—";
    feeTotal.textContent = formatInr(applied.ok ? applied.fee : FEE);
    payBtnAmount.textContent = formatInr(applied.ok ? applied.fee : FEE);
    if (applied.discount && applied.ok) {
      feeStruck.hidden = false;
      feeStruck.textContent = formatInr(FEE);
    } else {
      feeStruck.hidden = true;
    }
    promoMsg.textContent = applied.message;
    promoMsg.style.color = !raw || applied.ok ? "" : "#9b1c1c";
  }

  document.querySelector("#apply-promo")?.addEventListener("click", (e) => {
    e.preventDefault();
    paint();
  });
  promoInput?.addEventListener("input", paint);

  const params = new URLSearchParams(location.search);
  const city = document.querySelector("#city");
  if (params.get("city") && city) city.value = params.get("city");
  if (params.get("interest")) {
    const interest = document.querySelector("#interest");
    if (interest) interest.value = params.get("interest");
  }

  paint();

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("error");
    paint();

    if (!form.checkValidity()) {
      statusEl.textContent = "Please complete required fields.";
      statusEl.classList.add("error");
      form.reportValidity();
      return;
    }
    if (promoInput.value.trim() && !applied.ok) {
      statusEl.textContent = applied.message;
      statusEl.classList.add("error");
      return;
    }

    // Re-check capacity at submit time
    const check = calcPromo(promoInput.value);
    if (promoInput.value.trim() && !check.ok) {
      statusEl.textContent = check.message;
      statusEl.classList.add("error");
      paint();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const record = {
      ...data,
      id: `REG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      feeBase: FEE,
      discount: check.discount,
      feePayable: check.fee,
      promoCode: check.code,
      status: "pending_payment",
      paymentStatus: "unpaid",
      paymentProvider: "razorpay.me",
      paymentUrl: RAZORPAY_PAY_URL,
    };

    const regs = read(KEY_REGS);
    regs.push(record);
    write(KEY_REGS, regs);

    if (check.code) {
      const redemptions = read(KEY_PROMO);
      redemptions.push({
        code: check.code,
        registrationId: record.id,
        discount: check.discount,
        feePayable: check.fee,
        at: record.createdAt,
      });
      write(KEY_PROMO, redemptions);
    }

    window.open(RAZORPAY_PAY_URL, "_blank", "noopener");

    form.hidden = true;
    const success = document.querySelector("#success-panel");
    success.hidden = false;
    document.querySelector("#success-body").innerHTML = `
      <p>Reference <strong>${record.id}</strong></p>
      <p>${record.playerName} · ${record.city} · ${record.interest}</p>
      <p>Payable on form: <strong>${formatInr(record.feePayable)}</strong>${
        record.discount ? ` (discount ${formatInr(record.discount)})` : ""
      }</p>
      <p>Complete payment on the Razorpay page that just opened (ATLETAS INDIA SPORTS AND ENTERTAINMENT).</p>
      <p style="margin-top:1rem">
        <a class="btn btn-teal" href="${RAZORPAY_PAY_URL}" target="_blank" rel="noopener">Pay Now via Razorpay</a>
      </p>
      <p class="tbc-note">Keep your reference ID for confirmation with the organiser.</p>`;
  });
})();
