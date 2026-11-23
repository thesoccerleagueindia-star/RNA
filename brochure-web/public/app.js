(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const form = document.querySelector("#waitlist-form");
  const status = document.querySelector("#waitlist-status");
  const citySelect = document.querySelector("#city");

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
        const key = "aise-clinic-tour-2027-waitlist";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({
          ...data,
          id: `WL-${Date.now().toString(36).toUpperCase()}`,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        /* ignore */
      }
      status.textContent = "You’re on the waitlist. We’ll be in touch — no payment taken.";
      status.classList.remove("error");
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
            link.style.color = active ? "var(--green)" : "";
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.style.boxShadow = window.scrollY > 8 ? "0 8px 28px rgba(0,0,0,0.22)" : "none";
    },
    { passive: true }
  );
})();
