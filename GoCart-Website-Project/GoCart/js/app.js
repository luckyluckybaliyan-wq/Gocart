const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";
let cart = JSON.parse(localStorage.getItem("gocart-cart") || "[]");
let liked = new Set();

function visibleProducts() {
  let list = PRODUCTS.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
  if (sortMode === "price-low") list.sort((a,b) => a.price-b.price);
  if (sortMode === "price-high") list.sort((a,b) => b.price-a.price);
  if (sortMode === "rating") list.sort((a,b) => b.rating-a.rating);
  return list;
}
function renderProducts() {
  const list = visibleProducts();
  $("#productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image tone-${p.tone}">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="wishlist ${liked.has(p.id) ? "liked" : ""}" data-like="${p.id}" aria-label="Add ${p.name} to wishlist">${liked.has(p.id) ? "♥" : "♡"}</button>
        <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name-row"><h3 class="product-name">${p.name}</h3><span class="rating">★ ${p.rating}</span></div>
        <div class="product-bottom"><div><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
      </div>
    </article>`).join("");
  $("#resultCount").textContent = `Showing ${list.length} product${list.length===1?"":"s"}`;
  $("#emptyState").classList.toggle("hidden", list.length !== 0);
  $("#productGrid").classList.toggle("hidden", list.length === 0);
}
function saveCart() { localStorage.setItem("gocart-cart", JSON.stringify(cart)); }
function addToCart(id) {
  const item = cart.find(row => row.id === id);
  if (item) item.quantity += 1; else cart.push({id, quantity:1});
  saveCart(); renderCart(); showToast(`${PRODUCTS.find(p=>p.id===id).name} added to cart`);
}
function changeQuantity(id, amount) {
  const item = cart.find(row => row.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(row => row.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id) { cart = cart.filter(row => row.id !== id); saveCart(); renderCart(); }
function renderCart() {
  const count = cart.reduce((sum,row)=>sum+row.quantity,0);
  const subtotal = cart.reduce((sum,row)=>sum+PRODUCTS.find(p=>p.id===row.id).price*row.quantity,0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartItems").innerHTML = cart.map(row => {
    const p = PRODUCTS.find(item=>item.id===row.id);
    return `<div class="cart-item"><div class="cart-item-image">${p.emoji}</div><div><h3>${p.name}</h3><div class="cart-price">${money(p.price)}</div><div class="quantity-controls"><button data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${row.quantity}</span><button data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`;
  }).join("");
  $("#cartEmpty").classList.toggle("hidden", count > 0);
  $("#cartFooter").classList.toggle("hidden", count === 0);
  $("#cartItems").classList.toggle("hidden", count === 0);
}
function openCart() { $("#overlay").classList.remove("hidden"); $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
function closeCart() { $("#overlay").classList.add("hidden"); $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
let toastTimer;
function showToast(message) { const toast=$("#toast"); toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2400); }

$("#productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const like = event.target.closest("[data-like]");
  if (add) addToCart(Number(add.dataset.add));
  if (like) { const id=Number(like.dataset.like); liked.has(id)?liked.delete(id):liked.add(id); renderProducts(); }
});
$("#cartItems").addEventListener("click", event => {
  const qty=event.target.closest("[data-qty]"), remove=event.target.closest("[data-remove]");
  if(qty) changeQuantity(Number(qty.dataset.id),Number(qty.dataset.qty));
  if(remove) removeFromCart(Number(remove.dataset.remove));
});
document.querySelectorAll(".nav-category").forEach(button => button.addEventListener("click", () => {
  activeCategory=button.dataset.category;
  document.querySelectorAll(".nav-category").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts();
}));
$("#searchForm").addEventListener("submit", event => { event.preventDefault(); searchTerm=$("#searchInput").value.trim().toLowerCase(); renderProducts(); $("#products").scrollIntoView({behavior:"smooth"}); });
$("#searchInput").addEventListener("input", event => { searchTerm=event.target.value.trim().toLowerCase(); renderProducts(); });
$("#sortSelect").addEventListener("change", event => { sortMode=event.target.value; renderProducts(); });
$("#clearFilters").addEventListener("click", () => { activeCategory="All"; searchTerm=""; sortMode="featured"; $("#searchInput").value=""; $("#sortSelect").value="featured"; document.querySelectorAll(".nav-category").forEach(b=>b.classList.toggle("active",b.dataset.category==="All")); renderProducts(); });
$("#resetSearch").addEventListener("click", () => $("#clearFilters").click());
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if(event.key==="Escape") closeCart(); });
$("#checkoutButton").addEventListener("click", () => showToast("Demo checkout: connect a payment provider to accept orders."));
$("#accountButton").addEventListener("click", () => showToast("Account sign-in can be connected in a future version."));
$("#newsletterForm").addEventListener("submit", event => { event.preventDefault(); $("#newsletterMessage").textContent="Thanks for joining! This demo does not store email addresses."; $("#emailInput").value=""; });
$("#year").textContent=new Date().getFullYear();
renderProducts(); renderCart();
