(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const form = document.querySelector("#interest-form");
  const status = document.querySelector("#form-status");
  const citySelect = document.querySelector("#city");
  const interestSelect = document.querySelector("#interest");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  document.querySelectorAll("[data-city]").forEach((el) => {
    el.addEventListener("click", () => {
      const city = el.getAttribute("data-city");
      if (citySelect && city) citySelect.value = city;
    });
  });

  document.querySelectorAll("[data-interest]").forEach((el) => {
    el.addEventListener("click", () => {
      const interest = el.getAttribute("data-interest");
      if (interestSelect && interest) interestSelect.value = interest;
    });
  });

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.classList.remove("error");

      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.classList.add("error");
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const key = "atletas-india-clinic-tour-2027-interest";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({ ...data, submittedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        /* ignore storage failures in restricted contexts */
      }

      status.textContent =
        "Interest recorded locally for this preview. Production registration portals and CRM destination are TBC — Atletas India will follow up when live.";
      form.reset();
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-desktop a")];

  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.style.opacity = active ? "1" : "";
            link.style.color = active ? "var(--teal)" : "";
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      const y = window.scrollY;
      header.style.boxShadow =
        y > 8 ? "0 8px 28px rgba(0,0,0,0.22)" : "none";
      lastY = y;
    },
    { passive: true }
  );
})();
