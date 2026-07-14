const PRODUCTS = [
  {id:1, brand:"Apple", name:"iPhone 16 Pro", spec:"256GB · Titan Sa Mạc", price:29990000, oldPrice:32990000, tag:"Bán chạy", img:"../assets/img/iphone16pro.jpg",
    desc:"iPhone 16 Pro sở hữu khung Titan cao cấp, chip A18 Pro mạnh mẽ và hệ thống camera Pro giúp bạn chụp ảnh, quay video chuyên nghiệp ngay trên tay."},
  {id:2, brand:"Apple", name:"iPhone 16", spec:"128GB · Xanh Dương", price:21990000, oldPrice:null, tag:null, img:"../assets/img/iphone16.jpg",
    desc:"iPhone 16 mang thiết kế mới, chip A18 hiệu năng vượt trội và camera kép cải tiến, phù hợp cho mọi nhu cầu sử dụng hàng ngày."},
  {id:3, brand:"Apple", name:"iPhone 15", spec:"128GB · Hồng", price:17990000, oldPrice:19990000, tag:"Giảm giá", img:"../assets/img/iphone15.jpg",
    desc:"iPhone 15 với Dynamic Island, camera 48MP và hiệu năng ổn định — lựa chọn tối ưu về giá trị trong tầm giá."},
  {id:4, brand:"Samsung", name:"Galaxy S25 Ultra", spec:"256GB · Đen Titan", price:27990000, oldPrice:null, tag:"Mới", img:"../assets/img/galaxys25ultra.jpg",
    desc:"Galaxy S25 Ultra trang bị bút S Pen, camera 200MP và màn hình Dynamic AMOLED 2X đỉnh cao cho trải nghiệm sáng tạo không giới hạn."},
  {id:5, brand:"Samsung", name:"Galaxy S25", spec:"256GB · Xanh Bạc", price:19990000, oldPrice:22990000, tag:"Giảm giá", img:"../assets/img/galaxys25.jpg",
    desc:"Galaxy S25 nhỏ gọn nhưng mạnh mẽ, chip Snapdragon mới nhất cùng camera AI thông minh cho từng khoảnh khắc."},
  {id:6, brand:"Samsung", name:"Galaxy A56 5G", spec:"128GB · Đen", price:8990000, oldPrice:null, tag:null, img:"../assets/img/galaxya565g.jpg",
    desc:"Galaxy A56 5G là lựa chọn tầm trung đáng tiền với pin trâu, màn hình lớn sắc nét và hiệu năng mượt mà cho công việc lẫn giải trí."},
  {id:7, brand:"Xiaomi", name:"Xiaomi 15", spec:"256GB · Xanh Rêu", price:16990000, oldPrice:null, tag:"Mới", img:"../assets/img/xiaomi15.jpg",
    desc:"Xiaomi 15 kết hợp thiết kế cao cấp, camera Leica và hiệu năng đầu bảng, mang đến trải nghiệm flagship với mức giá hợp lý."},
  {id:8, brand:"Xiaomi", name:"Redmi Note 14 Pro", spec:"256GB · Tím", price:6990000, oldPrice:7990000, tag:"Giảm giá", img:"../assets/img/redminote14pro.jpg", 
    desc:"Redmi Note 14 Pro sở hữu màn hình cong AMOLED, sạc nhanh 67W và camera 200MP — phổ thông nhưng đầy đủ tính năng cao cấp."},
];

const fmt = n => n.toLocaleString('vi-VN') + '₫';
let currentFilter = 'Tất cả';
let cart = JSON.parse(localStorage.getItem('phonevn_cart') || '[]');

/* ---------- Trang chủ: sản phẩm nổi bật ---------- */
function renderFeatured(){
  const el = document.getElementById('featured-grid');
  if(!el) return;
  const featured = PRODUCTS.filter(p => p.tag).slice(0,4);
  el.innerHTML = featured.map(p => productCardHTML(p)).join('');
}

/* ---------- Trang sản phẩm: bộ lọc + lưới đầy đủ ---------- */
function renderFilters(){
  const el = document.getElementById('filters');
  if(!el) return;
  const brands = ['Tất cả', ...new Set(PRODUCTS.map(p=>p.brand))];
  el.innerHTML = brands.map(b =>
    `<button class="chip ${b===currentFilter?'active':''}" onclick="setFilter('${b}')">${b}</button>`
  ).join('');
}

function setFilter(b){
  currentFilter = b;
  renderFilters();
  renderProducts();
}

function productCardHTML(p){
  return `
    <div class="card">
      <a href="../html/chi-tiet.html?id=${p.id}" class="card-link">
        <div class="card-thumb"><img src="${p.img}" alt="${p.name}"></div>
        ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
        <h3>${p.name}</h3>
        <div class="spec">${p.spec}</div>
      </a>
      <div class="price-row">
        <span class="price">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
      </div>
      <button class="add-btn" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    </div>`;
}

function renderProducts(){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  const list = currentFilter === 'Tất cả' ? PRODUCTS : PRODUCTS.filter(p=>p.brand===currentFilter);
  const countEl = document.getElementById('result-count');
  if(countEl) countEl.textContent = list.length + ' sản phẩm';
  grid.innerHTML = list.map(p => productCardHTML(p)).join('');
}

/* ---------- Trang chi tiết sản phẩm ---------- */
function renderProductDetail(){
  const el = document.getElementById('product-detail');
  if(!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const p = PRODUCTS.find(pr => pr.id === id) || PRODUCTS[0];

  el.innerHTML = `
    <div class="detail-thumb"><img src="${p.img}" alt="${p.name}"></div>
    <div class="detail-info">
      ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
      <h1>${p.name}</h1>
      <div class="spec">${p.spec}</div>
      <div class="price-row">
        <span class="price" style="font-size:26px;">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
      </div>
      <p class="detail-desc">${p.desc}</p>
      <div class="detail-actions">
        <button class="qty-btn" onclick="changeQty(${p.id},-1); updateDetailQty(${p.id})">−</button>
        <span id="detail-qty">${(cart.find(i=>i.id===p.id)||{qty:0}).qty}</span>
        <button class="qty-btn" onclick="changeQty(${p.id},1); updateDetailQty(${p.id})">+</button>
        <button class="btn-primary" onclick="addToCart(${p.id}); updateDetailQty(${p.id})">Thêm vào giỏ</button>
      </div>
    </div>`;

  renderRelated(p);
}

function updateDetailQty(id){
  const span = document.getElementById('detail-qty');
  if(span) span.textContent = (cart.find(i=>i.id===id)||{qty:0}).qty;
}

function renderRelated(current){
  const el = document.getElementById('related-grid');
  if(!el) return;
  const related = PRODUCTS.filter(p => p.brand === current.brand && p.id !== current.id).slice(0,4);
  el.innerHTML = related.map(p => productCardHTML(p)).join('');
}

/* ---------- Trang liên hệ: form demo ---------- */
function submitContact(e){
  e.preventDefault();
  alert('Cảm ơn bạn đã liên hệ! (Đây là trang demo, chưa kết nối gửi tin nhắn thật)');
  e.target.reset();
  return false;
}

/* ---------- Giỏ hàng (dùng chung mọi trang) ---------- */
function addToCart(id){
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; }
  else{ cart.push({id, qty:1}); }
  saveCart();
  toggleCart(true);
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(i=>i.id!==id); }
  saveCart();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
}

function saveCart(){
  localStorage.setItem('phonevn_cart', JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const countEl = document.getElementById('cart-count');
  if(!countEl) return;
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  countEl.textContent = totalQty;

  const itemsEl = document.getElementById('drawer-items');
  if(cart.length === 0){
    itemsEl.innerHTML = `<div class="empty-cart">Giỏ hàng đang trống</div>`;
  } else {
    itemsEl.innerHTML = cart.map(i => {
      const p = PRODUCTS.find(pr=>pr.id===i.id);
      return `
        <div class="cart-item">
          <div class="cart-item-thumb">${p.brand}</div>
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div class="price">${fmt(p.price)}</div>
            <div class="qty-row">
              <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
              <span>${i.qty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
              <button class="remove-btn" onclick="removeItem(${p.id})">Xóa</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  const total = cart.reduce((s,i)=>{
    const p = PRODUCTS.find(pr=>pr.id===i.id);
    return s + p.price * i.qty;
  }, 0);
  document.getElementById('cart-total').textContent = fmt(total);
}

function toggleCart(show){
  document.getElementById('cart-drawer').classList.toggle('show', show);
  document.getElementById('overlay').classList.toggle('show', show);
}

function checkout(){
  if(cart.length === 0){ alert('Giỏ hàng đang trống!'); return; }
  alert('Cảm ơn bạn đã đặt hàng! (Đây là trang demo, chưa kết nối thanh toán thật)');
  cart = [];
  saveCart();
  toggleCart(false);
}

/* ---------- Khởi chạy theo từng trang ---------- */
renderFeatured();
renderFilters();
renderProducts();
renderProductDetail();
renderCart();