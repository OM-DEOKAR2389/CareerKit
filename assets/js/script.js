// Update these two values before publishing. Use the full international number
// for WhatsApp (digits only, including country code) and your confirmed UPI ID.
const WHATSAPP_NUMBER = "919096803246";
const UPI_ID = "omdeokar2389@ybl";

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

function whatsappUrl(product) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number.includes("XXXXXXXXXX")) return "";
  const message = `Hi CareerKit, I would like to order ${product.name} (${formatPrice(product.price)}). Please share the current payment details and confirm the ordering steps. I understand delivery is manual after payment verification.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price) { return `₹${price}`; }

function productCard(product) {
  return `<div class="col-sm-6 col-lg-4 col-xl-3"><article class="product-card">
    <div class="product-visual visual-${product.category}"><span class="visual-pattern" aria-hidden="true"></span><span class="product-category">${categoryNames[product.category]}</span><div class="visual-illustration" aria-hidden="true"><i class="ill-icon bi ${product.icon}"></i><i></i><i></i><i></i></div></div>
    <div class="product-body"><h3>${product.name}</h3><p>${product.description}</p><div class="product-card-footer"><span class="product-price">${formatPrice(product.price)} <small>one-time</small></span><div class="card-actions"><button class="btn btn-details" type="button" data-details="${product.id}" aria-label="View details for ${product.name}">Details</button>${orderButton(product,"card")}</div></div></div>
  </article></div>`;
}

function orderButton(product, context) {
  const url = whatsappUrl(product);
  if (!url) return `<button class="btn btn-primary btn-order" type="button" disabled title="WhatsApp ordering will be available after configuration">Configure WhatsApp</button>`;
  return `<a class="btn btn-primary btn-order" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Order ${product.name} on WhatsApp"><i class="bi bi-whatsapp ${context === "card" ? "me-1" : "me-2"}" aria-hidden="true"></i>${context === "card" ? "Order" : "Order on WhatsApp"}</a>`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = products.filter(product => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.description} ${categoryNames[product.category]}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map(productCard).join("");
  emptyState.classList.toggle("d-none", matches.length !== 0);
  document.getElementById("productCount").textContent = `${matches.length} ${matches.length === 1 ? "resource" : "resources"}`;
}

function showProductDetails(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  document.getElementById("modalProductIcon").innerHTML = `<i class="bi ${product.icon}"></i>`;
  document.getElementById("modalProductCategory").textContent = categoryNames[product.category];
  document.getElementById("productModalTitle").textContent = product.name;
  document.getElementById("modalProductDescription").textContent = product.description;
  document.getElementById("modalProductIncludes").innerHTML = product.includes.map(item => `<li>${item}</li>`).join("");
  document.getElementById("modalProductPrice").textContent = formatPrice(product.price);
  document.getElementById("modalOrderButton").outerHTML = orderButton(product, "modal").replace('class="btn btn-primary btn-order"','id="modalOrderButton" class="btn btn-primary w-100"');
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

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");
  if (button) showProductDetails(button.dataset.details);
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
renderProducts();
