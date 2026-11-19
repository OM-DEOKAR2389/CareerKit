// Update these two values before publishing. Use the full international number
// for WhatsApp (digits only, including country code) and your confirmed UPI ID.
const WHATSAPP_NUMBER = "919096803246";
const UPI_ID = "omdeokar2389@ybl";
// Set these customer-facing terms after confirming your current business policy.
const DELIVERY_TIME = "Confirm the expected delivery timing with CareerKit before paying.";
const REFUND_POLICY = "Please confirm the current refund terms with CareerKit before paying.";

const products = [
  {id:"basic-fresher-resume",name:"Basic Fresher Resume",category:"resume",price:49,description:"A clean, easy-to-edit resume starting point for students and fresh graduates applying for their first opportunities.",includes:["Simple, professional structure","Sections for education, skills and projects","Beginner-friendly editing guidance"],icon:"bi-file-earmark-person"},
  {id:"ats-resume-bundle",name:"ATS Resume Bundle",category:"resume",price:99,description:"A focused bundle of ATS-conscious resume layouts to help you present your experience clearly when applying online.",includes:["ATS-conscious formatting","Clear sections for experience and skills","Practical application tips"],icon:"bi-files"},
  {id:"developer-resume-bundle",name:"Developer Resume Bundle",category:"resume",price:149,description:"Resume layouts and guidance designed to help early-career developers highlight their projects and technical skills.",includes:["Developer-focused resume layouts","Project and technology sections","Guidance for showcasing practical work"],icon:"bi-code-square"},
  {id:"python-interview-questions",name:"Python Interview Questions",category:"interview",price:79,description:"A practical set of Python interview questions to help you review fundamentals and explain your thinking with confidence.",includes:["Core Python concepts","Common interview topics","Concise explanations for revision"],icon:"bi-chat-square-text"},
  {id:"sql-interview-questions",name:"SQL Interview Questions",category:"interview",price:79,description:"Review essential SQL topics and practice the kinds of questions that often come up in entry-level interviews.",includes:["Queries and joins","Core database concepts","Interview-focused practice questions"],icon:"bi-database-check"},
  {id:"technical-interview-bundle",name:"Technical Interview Bundle",category:"interview",price:149,description:"A broad technical interview preparation resource for learners preparing for entry-level technology roles.",includes:["Structured technical topic review","Practice questions across key areas","Revision-friendly organization"],icon:"bi-patch-question"},
  {id:"hr-interview-guide",name:"HR Interview Guide",category:"interview",price:49,description:"Prepare thoughtful answers to common HR questions and feel more at ease describing your goals and experience.",includes:["Common HR interview questions","Answer planning prompts","Preparation tips for freshers"],icon:"bi-people"},
  {id:"python-programming-notes",name:"Python Programming Notes",category:"notes",price:49,description:"Beginner-friendly notes covering Python concepts to support your learning and quick revision.",includes:["Programming fundamentals","Python syntax and key concepts","Quick revision structure"],icon:"bi-filetype-py"},
  {id:"html-css-javascript-notes",name:"HTML, CSS & JavaScript Notes",category:"notes",price:79,description:"A practical reference for the core building blocks of the web, from page structure to styling and interactivity.",includes:["HTML page structure","CSS styling fundamentals","JavaScript essentials"],icon:"bi-filetype-html"},
  {id:"dbms-sql-notes",name:"DBMS & SQL Notes",category:"notes",price:79,description:"Review database fundamentals and SQL concepts in one organized resource for coursework and interview prep.",includes:["Database fundamentals","Relational concepts","SQL query revision"],icon:"bi-journal-text"},
  {id:"full-stack-developer-notes",name:"Full Stack Developer Notes",category:"notes",price:149,description:"A guided overview of concepts used across the front end and back end of modern web development.",includes:["Front-end foundations","Back-end and API concepts","Organized full-stack revision"],icon:"bi-window-stack"}
];

const categoryNames = {resume:"Resume templates",interview:"Interview preparation",notes:"Programming notes"};
let activeCategory = "all";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("productSearch");
const emptyState = document.getElementById("emptyState");
let revealObserver = null;

function observeRevealTargets() {
  if (!revealObserver) return;
  document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(element => revealObserver.observe(element));
}

function initializeMotion() {
  const prefersReducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || typeof IntersectionObserver !== "function") return;

  try {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });

    const navSentinel = document.getElementById("navSentinel");
    if (navSentinel) {
      const navObserver = new IntersectionObserver(([entry]) => {
        document.querySelector(".site-nav")?.classList.toggle("is-scrolled", !entry.isIntersecting);
      }, { threshold: 0 });
      navObserver.observe(navSentinel);
    }

    observeRevealTargets();
    document.documentElement.classList.add("motion-ready");
  } catch (error) {
    revealObserver = null;
    document.documentElement.classList.remove("motion-ready");
  }
}

function whatsappUrl(product) {
  const number = String(WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if (!number || /x/i.test(WHATSAPP_NUMBER) || number.length < 8 || number.length > 15) return "";
  const message = `Hi CareerKit, I would like to order ${product.name} (${formatPrice(product.price)}). Please share the current payment details and confirm the ordering steps. I understand delivery is manual after payment verification.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price) { return `\u20B9${price}`; }

function productCard(product, index) {
  return `<div class="col-sm-6 col-lg-4 col-xl-3" data-reveal data-reveal-delay="${index % 4}"><article class="product-card">
    <div class="product-visual visual-${product.category}" role="img" aria-label="Illustrated preview for ${product.name}"><span class="visual-pattern" aria-hidden="true"></span><span class="product-category">${categoryNames[product.category]}</span><div class="visual-illustration" aria-hidden="true"><i class="ill-icon bi ${product.icon}"></i><i></i><i></i><i></i></div></div>
    <div class="product-body"><h3>${product.name}</h3><p>${product.description}</p><div class="product-includes-preview"><strong>What’s included</strong><ul>${product.includes.slice(0,2).map(item => `<li>${item}</li>`).join("")}</ul></div><div class="product-card-footer"><span class="product-price">${formatPrice(product.price)} <small>one-time</small></span><div class="card-actions"><button class="btn btn-details" type="button" data-details="${product.id}" aria-label="View details for ${product.name}">Details</button>${orderButton(product,"card")}</div></div></div>
  </article></div>`;
}

function orderButton(product, context) {
  const buttonClass = context === "modal" ? "btn btn-primary w-100" : "btn btn-primary btn-order";
  return `<button class="${buttonClass}" type="button" data-order="${product.id}" aria-label="Order ${product.name} on WhatsApp"><i class="bi bi-whatsapp ${context === "card" ? "me-1" : "me-2"}" aria-hidden="true"></i>Order on WhatsApp</button>`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = products.filter(product => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.description} ${categoryNames[product.category]}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map(productCard).join("");
  emptyState.classList.toggle("d-none", matches.length !== 0);
  document.getElementById("productCount").textContent = `${matches.length} ${matches.length === 1 ? "resource" : "resources"}`;
  observeRevealTargets();
}

function showProductDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const modalPreview = document.getElementById("modalProductPreview");
  modalPreview.className = `modal-product-preview visual-${product.category}`;
  modalPreview.innerHTML = `<div class="visual-illustration" role="img" aria-label="Illustrated preview for ${product.name}"><i class="ill-icon bi ${product.icon}" aria-hidden="true"></i><i></i><i></i><i></i></div>`;
  document.getElementById("modalProductCategory").textContent = categoryNames[product.category];
  document.getElementById("productModalTitle").textContent = product.name;
  document.getElementById("modalProductDescription").textContent = product.description;
  document.getElementById("modalProductIncludes").innerHTML = product.includes.map(item => `<li>${item}</li>`).join("");
  document.getElementById("modalProductAudience").textContent = product.category === "resume" ? "Students and fresh graduates preparing a resume." : product.category === "interview" ? "Learners preparing for entry-level interviews." : "Students and learners studying programming concepts.";
  document.getElementById("modalProductFormat").textContent = "Confirm available file formats and editing options with us before ordering.";
  document.getElementById("modalProductPrice").textContent = formatPrice(product.price);
  const modalOrderButton = document.getElementById("modalOrderButton");
  modalOrderButton.dataset.order = product.id;
  modalOrderButton.setAttribute("aria-label", `Order ${product.name} on WhatsApp`);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
}

document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(item => { const selected = item === button; item.classList.toggle("active", selected); item.setAttribute("aria-pressed", String(selected)); });
  renderProducts();
}));

document.querySelectorAll("[data-category-link]").forEach(link => link.addEventListener("click", () => {
  activeCategory = link.dataset.categoryLink;
  document.querySelectorAll("[data-filter]").forEach(item => { const selected = item.dataset.filter === activeCategory; item.classList.toggle("active", selected); item.setAttribute("aria-pressed", String(selected)); });
  renderProducts();
}));

searchInput.addEventListener("input", renderProducts);
document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = ""; activeCategory = "all";
  document.querySelectorAll("[data-filter]").forEach(item => { const selected = item.dataset.filter === "all"; item.classList.toggle("active", selected); item.setAttribute("aria-pressed", String(selected)); });
  renderProducts(); searchInput.focus();
});

document.addEventListener("click", event => {
  const orderButton = event.target.closest("[data-order]");
  if (orderButton) {
    event.preventDefault();
    const product = products.find(item => item.id === orderButton.dataset.order);
    if (!product) return;
    const url = whatsappUrl(product);
    if (!url) {
      window.alert("WhatsApp ordering is not configured yet. Please add a valid WhatsApp number with country code in assets/js/script.js.");
      return;
    }
    window.location.assign(url);
    return;
  }

  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    showProductDetails(detailsButton.dataset.details);
    return;
  }

  const contactButton = event.target.closest("[data-contact-whatsapp]");
  if (contactButton) {
    const number = String(WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!number || /x/i.test(String(WHATSAPP_NUMBER)) || number.length < 8 || number.length > 15) {
      window.alert("WhatsApp contact is not configured yet. Add a valid WhatsApp number with country code in assets/js/script.js.");
      return;
    }
    const message = "Hi CareerKit, I have a question about your resources.";
    window.location.assign(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
    return;
  }

  const navLink = event.target.closest("#mainNav .nav-link");
  const navCollapse = document.getElementById("mainNav");
  if (navLink && navCollapse.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
  }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
document.getElementById("deliveryPolicyText").textContent = DELIVERY_TIME;
document.getElementById("refundPolicyText").textContent = REFUND_POLICY;
document.getElementById("refundFaqAnswer").textContent = REFUND_POLICY;
initializeMotion();
renderProducts();
