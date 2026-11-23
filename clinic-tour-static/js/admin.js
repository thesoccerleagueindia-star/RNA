(() => {
  const utils = window.EVENT_UTILS;
  const regs = utils.storage.read(utils.storage.keyRegs);
  const wait = utils.storage.read(utils.storage.keyWait);
  const promos = utils.storage.read(utils.storage.keyPromo);

  const paid = regs.filter((r) => r.paymentStatus === "paid");
  const revenue = paid.reduce((s, r) => s + (r.feePayable || 0), 0);

  document.querySelector("#stats").innerHTML = `
    <div class="stat"><strong>${regs.length}</strong>Registrations</div>
    <div class="stat"><strong>${paid.length}</strong>Paid (demo)</div>
    <div class="stat"><strong>${wait.length}</strong>Waitlist</div>
    <div class="stat"><strong>${utils.formatInr(revenue)}</strong>Demo revenue</div>
  `;

  const promoBody = document.querySelector("#promo-table tbody");
  promoBody.innerHTML = promos.length
    ? promos
        .map(
          (p) =>
            `<tr><td>${p.code}</td><td>${p.registrationId}</td><td>${utils.formatInr(p.discount)}</td><td>${utils.formatInr(p.feePayable)}</td><td>${new Date(p.at).toLocaleString()}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="5">No promo redemptions yet. Try INAUGURAL10 on register.html</td></tr>`;

  const regBody = document.querySelector("#reg-table tbody");
  regBody.innerHTML = regs.length
    ? regs
        .map(
          (r) =>
            `<tr><td>${r.id}</td><td>${r.playerName}</td><td>${r.city}</td><td>${r.pathway || r.interest}</td><td>${utils.formatInr(r.feePayable ?? r.feeBase)}</td><td>${r.status} / ${r.paymentStatus}</td><td>${r.promoCode || "—"}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="7">No registrations yet.</td></tr>`;

  const waitBody = document.querySelector("#wait-table tbody");
  waitBody.innerHTML = wait.length
    ? wait
        .map(
          (w) =>
            `<tr><td>${w.id}</td><td>${w.playerName}</td><td>${w.city}</td><td>${w.interest}</td><td>${w.email}<br>${w.phone}</td><td>${new Date(w.createdAt).toLocaleString()}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="6">No waitlist entries yet.</td></tr>`;

  document.querySelector("#export-csv")?.addEventListener("click", () => {
    const header = ["id", "playerName", "city", "pathway", "feePayable", "status", "paymentStatus", "promoCode", "createdAt"];
    const rows = regs.map((r) => header.map((h) => JSON.stringify(r[h] ?? "")).join(","));
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clinic-tour-registrations-demo.csv";
    a.click();
  });

  document.querySelector("#clear-demo")?.addEventListener("click", () => {
    if (!confirm("Clear all demo registrations, waitlist and promo redemptions in this browser?")) return;
    localStorage.removeItem(utils.storage.keyRegs);
    localStorage.removeItem(utils.storage.keyWait);
    localStorage.removeItem(utils.storage.keyPromo);
    location.reload();
  });
})();
