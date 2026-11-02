/* Sanjay Pandey — portfolio scripts (vanilla JS) */
(function () {
  "use strict";

  var PHONE_1 = "8669143962";
  var PHONE_2 = "8975796567";
  var EMAIL = "sanjayppandey656@gmail.com";

  document.documentElement.classList.remove("no-js");

  /* year */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* nav: scrolled state + mobile menu */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".links");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); burger.classList.remove("open"); }
    });
  }

  /* active link */
  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".links a[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.classList.add("active");
  });

  /* scroll reveal */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* number counters */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = String(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    counters.forEach(function (c) { c.firstChild.nodeValue = "0"; });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* portrait tilt */
  var portrait = document.querySelector(".portrait");
  if (portrait && window.matchMedia("(hover: hover)").matches) {
    var frame = portrait.querySelector(".frame");
    portrait.addEventListener("mousemove", function (e) {
      var r = portrait.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = "perspective(900px) rotateY(" + (px * 7) + "deg) rotateX(" + (-py * 7) + "deg)";
    });
    portrait.addEventListener("mouseleave", function () { frame.style.transform = ""; });
  }

  /* marquee: duplicate content for a seamless loop */
  document.querySelectorAll(".marquee .track").forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* accordion */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var q = item.querySelector(".acc-q");
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open);
    });
  });

  /* toast */
  var toast = document.querySelector(".toast");
  var tt;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  }

  /* copy buttons */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var v = b.getAttribute("data-copy");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(v).then(function () { showToast("Copied: " + v); });
      } else { showToast(v); }
    });
  });

  /* connect form */
  var form = document.getElementById("connect-form");
  if (form) {
    var err = form.querySelector(".err");
    function compose() {
      var name = form.elements["name"].value.trim();
      var from = form.elements["contact"].value.trim();
      var msg = form.elements["message"].value.trim();
      var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || "General enquiry";
      if (!name || !msg) {
        err.textContent = "Please add your name and a short message.";
        return null;
      }
      err.textContent = "";
      return { name: name, from: from, msg: msg, topic: topic };
    }
    form.querySelector("[data-send='wa']").addEventListener("click", function () {
      var d = compose(); if (!d) return;
      var text = "Hello Sanjay,\n\nI'm " + d.name + ". Reaching out regarding: " + d.topic + ".\n\n" + d.msg +
        (d.from ? "\n\nYou can reach me at: " + d.from : "");
      window.open("https://wa.me/91" + PHONE_1 + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
    form.querySelector("[data-send='mail']").addEventListener("click", function () {
      var d = compose(); if (!d) return;
      var body = "Hello Sanjay,\n\n" + d.msg + "\n\nRegards,\n" + d.name + (d.from ? "\n" + d.from : "");
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(d.topic + " — " + d.name) + "&body=" + encodeURIComponent(body);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  /* save contact (vCard) */
  var vc = document.getElementById("save-vcard");
  if (vc) {
    vc.addEventListener("click", function (e) {
      e.preventDefault();
      var card = [
        "BEGIN:VCARD", "VERSION:3.0",
        "N:Pandey;Sanjay;;;", "FN:Sanjay Pandey",
        "ORG:Damodar Industries Limited", "TITLE:Manager HR",
        "TEL;TYPE=CELL:+91" + PHONE_1, "TEL;TYPE=CELL:+91" + PHONE_2,
        "EMAIL:" + EMAIL, "ADR;TYPE=WORK:;;Amravati;;Maharashtra;;India",
        "END:VCARD"
      ].join("\r\n");
      var blob = new Blob([card], { type: "text/vcard" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Sanjay-Pandey.vcf";
      document.body.appendChild(a); a.click(); a.remove();
      showToast("Contact card downloaded");
    });
  }
})();
