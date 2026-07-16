var dangOTrangCon = window.location.pathname.indexOf("/html/") !== -1;
var BASE = dangOTrangCon ? "../" : "";

// Danh sách sản phẩm
var PRODUCTS = [
  {id:1, brand:"Apple", name:"iPhone 16 Pro", spec:"256GB · Titan Sa Mạc", price:29990000, oldPrice:32990000, tag:"Bán chạy", img:"assets/img/iphone16pro.jpg",
    desc:"iPhone 16 Pro sở hữu khung Titan cao cấp, chip A18 Pro mạnh mẽ và hệ thống camera Pro giúp bạn chụp ảnh, quay video chuyên nghiệp ngay trên tay."},
  {id:2, brand:"Apple", name:"iPhone 16", spec:"128GB · Xanh Dương", price:21990000, oldPrice:null, tag:null, img:"assets/img/iphone16.jpg",
    desc:"iPhone 16 mang thiết kế mới, chip A18 hiệu năng vượt trội và camera kép cải tiến, phù hợp cho mọi nhu cầu sử dụng hàng ngày."},
  {id:3, brand:"Apple", name:"iPhone 15", spec:"128GB · Hồng", price:17990000, oldPrice:19990000, tag:"Giảm giá", img:"assets/img/iphone15.jpg",
    desc:"iPhone 15 với Dynamic Island, camera 48MP và hiệu năng ổn định — lựa chọn tối ưu về giá trị trong tầm giá."},
  {id:4, brand:"Samsung", name:"Galaxy S25 Ultra", spec:"256GB · Đen Titan", price:27990000, oldPrice:null, tag:"Mới", img:"assets/img/galaxys25ultra.jpg",
    desc:"Galaxy S25 Ultra trang bị bút S Pen, camera 200MP và màn hình Dynamic AMOLED 2X đỉnh cao cho trải nghiệm sáng tạo không giới hạn."},
  {id:5, brand:"Samsung", name:"Galaxy S25", spec:"256GB · Xanh Bạc", price:19990000, oldPrice:22990000, tag:"Giảm giá", img:"assets/img/galaxys25.jpg",
    desc:"Galaxy S25 nhỏ gọn nhưng mạnh mẽ, chip Snapdragon mới nhất cùng camera AI thông minh cho từng khoảnh khắc."},
  {id:6, brand:"Samsung", name:"Galaxy A56 5G", spec:"128GB · Đen", price:8990000, oldPrice:null, tag:null, img:"assets/img/galaxya565g.jpg",
    desc:"Galaxy A56 5G là lựa chọn tầm trung đáng tiền với pin trâu, màn hình lớn sắc nét và hiệu năng mượt mà cho công việc lẫn giải trí."},
  {id:7, brand:"Xiaomi", name:"Xiaomi 15", spec:"256GB · Xanh Rêu", price:16990000, oldPrice:null, tag:"Mới", img:"assets/img/xiaomi15.jpg",
    desc:"Xiaomi 15 kết hợp thiết kế cao cấp, camera Leica và hiệu năng đầu bảng, mang đến trải nghiệm flagship với mức giá hợp lý."},
  {id:8, brand:"Xiaomi", name:"Redmi Note 14 Pro", spec:"256GB · Tím", price:6990000, oldPrice:7990000, tag:"Giảm giá", img:"assets/img/redminote14pro.jpg",
    desc:"Redmi Note 14 Pro sở hữu màn hình cong AMOLED, sạc nhanh 67W và camera 200MP — phổ thông nhưng đầy đủ tính năng cao cấp."}
];

// Định dạng số tiền theo kiểu Việt Nam, ví dụ 21990000 -> "21.990.000₫"
function fmt(soTien) {
  return soTien.toLocaleString('vi-VN') + '₫';
}

// Tìm sản phẩm theo id, dùng vòng lặp for
function timSanPhamTheoId(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return null;
}

// Bộ lọc thương hiệu đang chọn (dùng cho trang sản phẩm)
var currentFilter = 'Tất cả';

// Giỏ hàng: mảng các {id, qty}, lưu vào localStorage để không mất khi tải lại trang
var cart = [];
var duLieuLuu = localStorage.getItem('phonevn_cart');
if (duLieuLuu) {
  cart = JSON.parse(duLieuLuu);
}

// Tìm sản phẩm trong giỏ hàng theo id
function timTrongGio(id) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) return cart[i];
  }
  return null;
}

/* ---------- Tạo HTML cho 1 thẻ sản phẩm ---------- */
function productCardHTML(p) {
  var html = '<div class="card">';
  html += '<a href="' + BASE + 'html/chi-tiet.html?id=' + p.id + '" class="card-link">';
  html += '<div class="card-thumb"><img src="' + BASE + p.img + '" alt="' + p.name + '"></div>';
  if (p.tag) {
    html += '<span class="badge">' + p.tag + '</span>';
  }
  html += '<h3>' + p.name + '</h3>';
  html += '<div class="spec">' + p.spec + '</div>';
  html += '</a>';
  html += '<div class="price-row">';
  html += '<span class="price">' + fmt(p.price) + '</span>';
  if (p.oldPrice) {
    html += '<span class="price-old">' + fmt(p.oldPrice) + '</span>';
  }
  html += '</div>';
  html += '<button class="add-btn" onclick="addToCart(' + p.id + ')">Thêm vào giỏ</button>';
  html += '</div>';
  return html;
}

/* ---------- Trang chủ: 4 sản phẩm nổi bật (có tag) ---------- */
function renderFeatured() {
  var el = document.getElementById('featured-grid');
  if (!el) return;

  var html = '';
  var soLuong = 0;
  for (var i = 0; i < PRODUCTS.length && soLuong < 4; i++) {
    if (PRODUCTS[i].tag) {
      html += productCardHTML(PRODUCTS[i]);
      soLuong++;
    }
  }
  el.innerHTML = html;
}

/* ---------- Trang sản phẩm: danh sách nút lọc theo hãng ---------- */
function renderFilters() {
  var el = document.getElementById('filters');
  if (!el) return;

  // Gom danh sách hãng, không trùng lặp
  var brands = ['Tất cả'];
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (brands.indexOf(PRODUCTS[i].brand) === -1) {
      brands.push(PRODUCTS[i].brand);
    }
  }

  var html = '';
  for (var j = 0; j < brands.length; j++) {
    var dangChon = (brands[j] === currentFilter) ? 'active' : '';
    html += '<button class="chip ' + dangChon + '" onclick="setFilter(\'' + brands[j] + '\')">' + brands[j] + '</button>';
  }
  el.innerHTML = html;
}

function setFilter(brand) {
  currentFilter = brand;
  renderFilters();
  renderProducts();
}

/* ---------- Trang sản phẩm: lưới đầy đủ theo bộ lọc ---------- */
function renderProducts() {
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  var html = '';
  var soLuong = 0;
  for (var i = 0; i < PRODUCTS.length; i++) {
    var p = PRODUCTS[i];
    if (currentFilter === 'Tất cả' || p.brand === currentFilter) {
      html += productCardHTML(p);
      soLuong++;
    }
  }
  grid.innerHTML = html;

  var countEl = document.getElementById('result-count');
  if (countEl) countEl.textContent = soLuong + ' sản phẩm';
}

/* ---------- Trang chi tiết sản phẩm ---------- */
function renderProductDetail() {
  var el = document.getElementById('product-detail');
  if (!el) return;

  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'));
  var p = timSanPhamTheoId(id);
  if (!p) p = PRODUCTS[0];

  var itemTrongGio = timTrongGio(p.id);
  var soLuongTrongGio = itemTrongGio ? itemTrongGio.qty : 0;

  var html = '<div class="detail-thumb"><img src="' + BASE + p.img + '" alt="' + p.name + '"></div>';
  html += '<div class="detail-info">';
  if (p.tag) {
    html += '<span class="badge">' + p.tag + '</span>';
  }
  html += '<h1>' + p.name + '</h1>';
  html += '<div class="spec">' + p.spec + '</div>';
  html += '<div class="price-row">';
  html += '<span class="price price-lg">' + fmt(p.price) + '</span>';
  if (p.oldPrice) {
    html += '<span class="price-old">' + fmt(p.oldPrice) + '</span>';
  }
  html += '</div>';
  html += '<p class="detail-desc">' + p.desc + '</p>';
  html += '<div class="detail-actions">';
  html += '<button class="qty-btn" onclick="changeQty(' + p.id + ',-1); updateDetailQty(' + p.id + ')">−</button>';
  html += '<span id="detail-qty">' + soLuongTrongGio + '</span>';
  html += '<button class="qty-btn" onclick="changeQty(' + p.id + ',1); updateDetailQty(' + p.id + ')">+</button>';
  html += '<button class="btn-primary" onclick="addToCart(' + p.id + '); updateDetailQty(' + p.id + ')">Thêm vào giỏ</button>';
  html += '</div></div>';

  el.innerHTML = html;

  renderRelated(p);
}

function updateDetailQty(id) {
  var span = document.getElementById('detail-qty');
  if (!span) return;
  var item = timTrongGio(id);
  span.textContent = item ? item.qty : 0;
}

/* ---------- Sản phẩm liên quan: cùng hãng, khác sản phẩm hiện tại ---------- */
function renderRelated(current) {
  var el = document.getElementById('related-grid');
  if (!el) return;

  var html = '';
  var soLuong = 0;
  for (var i = 0; i < PRODUCTS.length && soLuong < 4; i++) {
    var p = PRODUCTS[i];
    if (p.brand === current.brand && p.id !== current.id) {
      html += productCardHTML(p);
      soLuong++;
    }
  }
  el.innerHTML = html;
}

/* ---------- Trang liên hệ: form demo ---------- */
function submitContact(e) {
  e.preventDefault();
  alert('Cảm ơn bạn đã liên hệ! (Đây là trang demo, chưa kết nối gửi tin nhắn thật)');
  e.target.reset();
  return false;
}

/* ---------- Giỏ hàng (dùng chung mọi trang) ---------- */
function addToCart(id) {
  var item = timTrongGio(id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({id: id, qty: 1});
  }
  saveCart();
  toggleCart(true);
}

function changeQty(id, delta) {
  var item = timTrongGio(id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    // xóa sản phẩm khỏi giỏ khi số lượng về 0
    var gioMoi = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id !== id) gioMoi.push(cart[i]);
    }
    cart = gioMoi;
  }
  saveCart();
}

function removeItem(id) {
  var gioMoi = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) gioMoi.push(cart[i]);
  }
  cart = gioMoi;
  saveCart();
}

function saveCart() {
  localStorage.setItem('phonevn_cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  var countEl = document.getElementById('cart-count');
  if (!countEl) return;

  // Tổng số lượng sản phẩm trong giỏ
  var tongSoLuong = 0;
  for (var i = 0; i < cart.length; i++) {
    tongSoLuong += cart[i].qty;
  }
  countEl.textContent = tongSoLuong;

  // Danh sách sản phẩm trong ngăn giỏ hàng
  var itemsEl = document.getElementById('drawer-items');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="empty-cart">Giỏ hàng đang trống</div>';
  } else {
    var html = '';
    for (var j = 0; j < cart.length; j++) {
      var p = timSanPhamTheoId(cart[j].id);
      html += '<div class="cart-item">';
      html += '<div class="cart-item-thumb">' + p.brand + '</div>';
      html += '<div class="cart-item-info">';
      html += '<h4>' + p.name + '</h4>';
      html += '<div class="price">' + fmt(p.price) + '</div>';
      html += '<div class="qty-row">';
      html += '<button class="qty-btn" onclick="changeQty(' + p.id + ',-1)">−</button>';
      html += '<span>' + cart[j].qty + '</span>';
      html += '<button class="qty-btn" onclick="changeQty(' + p.id + ',1)">+</button>';
      html += '<button class="remove-btn" onclick="removeItem(' + p.id + ')">Xóa</button>';
      html += '</div></div></div>';
    }
    itemsEl.innerHTML = html;
  }

  // Tính tổng tiền
  var tongTien = 0;
  for (var k = 0; k < cart.length; k++) {
    var sp = timSanPhamTheoId(cart[k].id);
    tongTien += sp.price * cart[k].qty;
  }
  document.getElementById('cart-total').textContent = fmt(tongTien);
}

function toggleCart(show) {
  document.getElementById('cart-drawer').classList.toggle('show', show);
  document.getElementById('overlay').classList.toggle('show', show);
}

function checkout() {
  if (cart.length === 0) {
    alert('Giỏ hàng đang trống!');
    return;
  }
  alert('Cảm ơn bạn đã đặt hàng! (Đây là trang demo, chưa kết nối thanh toán thật)');
  cart = [];
  saveCart();
  toggleCart(false);
}

/* ---------- Khởi chạy khi trang tải xong ---------- */
renderFeatured();
renderFilters();
renderProducts();
renderProductDetail();
renderCart();
