(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const form = document.querySelector("#waitlist-form");
  const status = document.querySelector("#waitlist-status");
  const citySelect = document.querySelector("#city");
  const KEY_WAITLIST = "aise-clinic-tour-2027-waitlist";

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

  function saveLocal(data) {
    try {
      const existing = JSON.parse(localStorage.getItem(KEY_WAITLIST) || "[]");
      existing.push(data);
      localStorage.setItem(KEY_WAITLIST, JSON.stringify(existing));
    } catch {
      /* ignore */
    }
  }

  function rlsHint(msg) {
    if (/row-level security|42501/i.test(msg || "")) {
      return " Supabase RLS is blocking inserts — run supabase/fix-rls-for-public-forms.sql in the SQL Editor, then retry.";
    }
    return "";
  }

  if (form && status) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.classList.remove("error");
      status.textContent = "";
      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.classList.add("error");
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      data.consent = Boolean(form.querySelector('[name="consent"]')?.checked);
      const localRecord = {
        ...data,
        id: `WL-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.textContent = "Submitting…";

      let savedId = localRecord.id;
      let ok = false;
      let lastErr = "";

      // 1) Primary: browser → Supabase (works on static Hostinger)
      try {
        if (!window.RNA_SUPABASE?.configured?.()) {
          throw new Error("Supabase config missing in config.js");
        }
        const r = await window.RNA_SUPABASE.insertWaitlist(data);
        savedId = r.id;
        ok = true;
        saveLocal({ ...localRecord, id: savedId, source: "supabase-browser" });
      } catch (err) {
        lastErr = String(err.message || err);
        // 2) Optional Node API if present
        try {
          const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.ok !== false) {
            savedId = json.id || savedId;
            ok = true;
            saveLocal({ ...localRecord, id: savedId, source: "api" });
          } else {
            throw new Error(json.error || lastErr || `Server ${res.status}`);
          }
        } catch (err2) {
          lastErr = String(err2.message || err2 || lastErr);
          saveLocal({
            ...localRecord,
            source: "localStorage-fallback",
            error: lastErr,
          });
          status.textContent =
            `Could not save to Supabase: ${lastErr}.${rlsHint(lastErr)} Or email CONTACT@AISEORG.INFO.`;
          status.classList.add("error");
        }
      }

      if (ok) {
        status.textContent = `You’re on the waitlist. Reference ${savedId}. No payment taken.`;
        form.reset();
      }
      if (submitBtn) submitBtn.disabled = false;
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
