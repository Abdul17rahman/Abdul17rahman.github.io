// ---------- nav scroll state ----------
const navEl = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    navEl.classList.toggle("scrolled", window.scrollY > 20);
  },
  {
    passive: true,
  },
);

// ---------- mobile menu ----------
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open")),
  );

// ---------- active nav link on scroll ----------
const sections = document.querySelectorAll("section[id]");
const navA = document.querySelectorAll("nav.links a[data-nav]");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navA.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id,
          ),
        );
      }
    });
  },
  {
    rootMargin: "-40% 0px -50% 0px",
  },
);
sections.forEach((s) => navObserver.observe(s));

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- hero role typewriter ----------
const roles = [
  "Software Developer",
  "AWS Cloud Architect",
  "DevOps Engineer",
  "Full-Stack Engineer",
];
const roleEl = document.getElementById("roleText");
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function typeLoop() {
  let roleIdx = 0,
    charIdx = 0,
    deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIdx--;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
}
if (prefersReduced) {
  roleEl.textContent = roles[0];
} else {
  typeLoop();
}

// ---------- terminal final command typing ----------
const typedCmd = document.getElementById("typedCmd");
const finalCmd = "open ./contact --lets talk";
if (prefersReduced) {
  typedCmd.textContent = finalCmd;
} else {
  let i = 0;

  function typeCmd() {
    if (i <= finalCmd.length) {
      typedCmd.textContent = finalCmd.slice(0, i);
      i++;
      setTimeout(typeCmd, 60);
    }
  }
  setTimeout(typeCmd, 600);
}

// ---------- metrics count-up ----------
const metricEls = document.querySelectorAll(".metric-card .num");
const metricObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const isDecimal = target % 1 !== 0;
        let start = null;
        const duration = 1200;

        function step(ts) {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          el.textContent =
            (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else
            el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        }
        requestAnimationFrame(step);
        metricObserver.unobserve(el);
      }
    });
  },
  {
    threshold: 0.4,
  },
);
metricEls.forEach((el) => metricObserver.observe(el));

// ---------- contact form (mailto handoff, no backend) ----------
const form = document.getElementById("contact-form");
const formMsg = document.getElementById("formMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg").value.trim();
  if (!name || !email || !msg) {
    formMsg.style.color = "#f2a75e";
    formMsg.textContent = "// fill in every field before sending";
    return;
  }
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:abdulnsamba@gmail.com?subject=${subject}&body=${body}`;
  formMsg.style.color = "#35d488";
  formMsg.textContent = "// opening your email client…";
  form.reset();
});
