(() => {
  const cfg = window.EVENT_CONFIG;
  const utils = window.EVENT_UTILS;

  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      })
    );
  }

  const grid = document.querySelector("#city-grid");
  if (grid && cfg) {
    grid.innerHTML = cfg.cities
      .map((city) => {
        const open = city.status === "registration_open";
        const days = (city.days || [])
          .map((d) => `<li><strong>${d.label}</strong> — ${d.category}</li>`)
          .join("");
        const cta = open
          ? `<a class="btn btn-gold btn-block" href="register.html?city=${encodeURIComponent(city.name)}">Register · ${utils.formatInr(cfg.feeInr)}</a>`
          : `<a class="btn btn-navy btn-block" href="waitlist.html?city=${encodeURIComponent(city.name)}">Join ${city.name} Waitlist</a>`;
        return `<article class="city-card ${open ? "" : "waitlist"}" id="city-${city.id}">
          <div class="city-top">
            <h3 class="city-name">${city.name}</h3>
            <span class="badge ${open ? "" : "wait"}">${open ? "Registration Open" : "Join Waitlist"}</span>
          </div>
          <p class="city-dates">${city.datesLabel}</p>
          <p class="city-meta">Venue: ${city.venue}</p>
          <p class="city-meta">Capacity (provisional): ${city.capacity} slots</p>
          ${days ? `<ul class="day-list">${days}</ul>` : ""}
          ${open ? `<p class="fee-line">${utils.formatInr(cfg.feeInr)} clinic registration</p>` : ""}
          ${cta}
        </article>`;
      })
      .join("");
  }
})();
