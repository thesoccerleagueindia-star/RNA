(() => {
  const FEE = 3850;
  const FEE_LABEL = "inclusive of GST";
  /** Live Razorpay.me Pay Now link (organiser payment page — ₹3,850). */
  const RAZORPAY_PAY_URL =
    "https://razorpay.me/@rnaclinicindia2027?amount=trAZ1UkbSzNzZMEB9OinbA%3D%3D";
  const KEY_REGS = "aise-clinic-tour-2027-registrations";

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

  form?.addEventListener("submit", (event) => {
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
    const record = {
      ...data,
      id: `REG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      feeBase: FEE,
      feePayable: FEE,
      feeNote: FEE_LABEL,
      status: "pending_payment",
      paymentStatus: "unpaid",
      paymentProvider: "razorpay.me",
      paymentUrl: RAZORPAY_PAY_URL,
    };

    const regs = read(KEY_REGS);
    regs.push(record);
    write(KEY_REGS, regs);

    window.open(RAZORPAY_PAY_URL, "_blank", "noopener");

    form.hidden = true;
    const success = document.querySelector("#success-panel");
    success.hidden = false;
    document.querySelector("#success-body").innerHTML = `
      <p>Reference <strong>${record.id}</strong></p>
      <p>${record.playerName} · ${record.city} · ${record.interest}</p>
      <p>Payable: <strong>${formatInr(FEE)}</strong> <span class="tbc-note">(${FEE_LABEL})</span></p>
      <p>Complete payment on the Razorpay page that just opened (ATLETAS INDIA SPORTS AND ENTERTAINMENT).</p>
      <p style="margin-top:1rem">
        <a class="btn btn-teal" href="${RAZORPAY_PAY_URL}" target="_blank" rel="noopener">Pay Now via Razorpay</a>
      </p>
      <p class="tbc-note">Keep your reference ID for confirmation with the organiser.</p>`;
  });
})();
