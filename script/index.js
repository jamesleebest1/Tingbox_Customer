// Firebase Configuration
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "modern-supermarket.firebaseapp.com",
  databaseURL: "https://modern-supermarket-default-rtdb.firebaseio.com/",
  projectId: "modern-supermarket",
  storageBucket: "modern-supermarket.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
};

// Uncomment và thay đổi config thực tế khi deploy
// firebase.initializeApp(firebaseConfig);
// const database = firebase.database();

// Dữ liệu sản phẩm
const products = [
  { id: 1, name: "Bàn chải đánh răng", price: 25000, emoji: "🪥" },
  { id: 2, name: "Cá tươi", price: 120000, emoji: "🐟" },
  { id: 3, name: "Thịt bò", price: 250000, emoji: "🥩" },
  { id: 4, name: "Trứng gà", price: 45000, emoji: "🥚" },
  { id: 5, name: "Rượu vang", price: 180000, emoji: "🍷" },
  { id: 6, name: "Kem", price: 35000, emoji: "🍦" },
  { id: 7, name: "Rau xanh", price: 20000, emoji: "🥬" },
  { id: 8, name: "Củ cà rót", price: 15000, emoji: "🥕" },
  { id: 9, name: "Bim bim", price: 12000, emoji: "🍿" },
  { id: 10, name: "Cà phê Trung Nguyên", price: 85000, emoji: "☕" },
  { id: 11, name: "Bánh mì", price: 8000, emoji: "🍞" },
  { id: 12, name: "Sữa tươi", price: 28000, emoji: "🥛" },
  { id: 13, name: "Táo", price: 40000, emoji: "🍎" },
  { id: 14, name: "Chuối", price: 25000, emoji: "🍌" },
  { id: 15, name: "Nước ngọt", price: 15000, emoji: "🥤" },
  { id: 16, name: "Gạo", price: 65000, emoji: "🍚" },
  { id: 17, name: "Dầu ăn", price: 55000, emoji: "🫒" },
  { id: 18, name: "Tương ớt", price: 18000, emoji: "🌶️" },
  { id: 19, name: "Kẹo", price: 22000, emoji: "🍬" },
  { id: 20, name: "Bánh quy", price: 32000, emoji: "🍪" },
];

// State management
let cart = {};
let currentOrder = null;

// Khởi tạo trang
function initializePage() {
  renderProducts();
  updateCartDisplay();
}

// Render sản phẩm
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products
    .map(
      (product) => `
          <div class="product-card glass-container" data-product-id="${
            product.id
          }">
              <div class="product-emoji">${product.emoji}</div>
              <div class="product-name">${product.name}</div>
              <div class="product-price">${formatPrice(product.price)}</div>
              <div class="quantity-controls">
                  <button class="quantity-btn" onclick="changeQuantity(${
                    product.id
                  }, -1)">-</button>
                  <div class="quantity-display" id="qty-${product.id}">0</div>
                  <button class="quantity-btn" onclick="changeQuantity(${
                    product.id
                  }, 1)">+</button>
              </div>
              <button class="add-to-cart-btn" onclick="addToCart(${
                product.id
              })">
                  🛒 Thêm vào giỏ
              </button>
          </div>
      `
    )
    .join("");
}

// Thay đổi số lượng
function changeQuantity(productId, change) {
  const currentQty = parseInt(
    document.getElementById(`qty-${productId}`).textContent
  );
  const newQty = Math.max(0, currentQty + change);
  document.getElementById(`qty-${productId}`).textContent = newQty;
}

// Thêm vào giỏ hàng
function addToCart(productId) {
  const quantity = parseInt(
    document.getElementById(`qty-${productId}`).textContent
  );
  if (quantity === 0) {
    showNotification("Vui lòng chọn số lượng!", "error");
    return;
  }

  if (!cart[productId]) {
    cart[productId] = 0;
  }
  cart[productId] += quantity;

  // Reset quantity display
  document.getElementById(`qty-${productId}`).textContent = "0";

  updateCartDisplay();
  showNotification("Đã thêm vào giỏ hàng!", "success");
}
// Cập nhật progress steps
function updateProgressStep(step) {
  document.querySelectorAll(".step").forEach((el, index) => {
    if (index + 1 <= step) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

// Cập nhật trong các function chuyển trang
// Trong showPage function, thêm:
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");

  // Cập nhật progress
  if (pageId === "productPage") updateProgressStep(1);
  else if (pageId === "shippingPage") updateProgressStep(2);
  else if (pageId === "invoicePage") updateProgressStep(3);
}
// Cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id == id);
    return sum + product.price * qty;
  }, 0);

  document.getElementById("cartCount").textContent = cartCount;
  document.getElementById("cartTotal").textContent = formatPrice(cartTotal);
  document.getElementById("totalItems").textContent = cartCount;
}

// Format giá tiền
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Tiến hành checkout
function proceedToCheckout() {
  if (Object.keys(cart).length === 0) {
    showNotification("Giỏ hàng trống!", "error");
    return;
  }

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id == id);
      return `${product.emoji} ${product.name} x${qty}`;
    })
    .join("<br>");

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id == id);
    return sum + product.price * qty;
  }, 0);

  showModal(
    `
          <h3 style="text-align: center; margin-bottom: 20px; color: #2c3e50;">
              🛒 Xác nhận đơn hàng
          </h3>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
              <strong>Sản phẩm:</strong><br>
              ${cartItems}
          </div>
          <div style="text-align: center; font-size: 18px; font-weight: 700; color: #e74c3c;">
              Tổng tiền: ${formatPrice(total)}
          </div>
          <p style="text-align: center; margin-top: 15px; color: #666;">
              Bạn có muốn tiếp tục đặt hàng không?
          </p>
      `,
    () => {
      showPage("shippingPage");
      closeModal();
    }
  );
}

// Hiển thị trang
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
}

// Quay lại trang trước
function goBack(pageId) {
  showPage(pageId);
}

// Xử lý form giao hàng
document
  .getElementById("shippingForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById("fullName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      address: document.getElementById("address").value,
      paymentMethod: document.getElementById("paymentMethod").value,
    };

    const paymentMethods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      bank: "Chuyển khoản ngân hàng",
      card: "Thẻ tín dụng",
      momo: "Ví MoMo",
    };

    showModal(
      `
          <h3 style="text-align: center; margin-bottom: 20px; color: #2c3e50;">
              📦 Xác nhận thông tin giao hàng
          </h3>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
              <p><strong>👤 Người nhận:</strong> ${formData.fullName}</p>
              <p><strong>📱 Điện thoại:</strong> ${formData.phoneNumber}</p>
              <p><strong>📍 Địa chỉ:</strong> ${formData.address}</p>
              <p><strong>💳 Thanh toán:</strong> ${
                paymentMethods[formData.paymentMethod]
              }</p>
          </div>
          <p style="text-align: center; margin-top: 15px; color: #666;">
              Xác nhận thông tin và tiến hành giao hàng?
          </p>
      `,
      () => {
        processOrder(formData);
        closeModal();
      }
    );
  });

// Xử lý đơn hàng
function processOrder(shippingInfo) {
  const orderId = generateOrderId();
  const trackingCode = generateTrackingCode();
  const orderDate = new Date().toLocaleString("vi-VN");

  currentOrder = {
    orderId,
    trackingCode,
    orderDate,
    shippingInfo,
    items: Object.entries(cart).map(([id, qty]) => {
      const product = products.find((p) => p.id == id);
      return {
        id: product.id,
        name: product.name,
        emoji: product.emoji,
        price: product.price,
        quantity: qty,
        total: product.price * qty,
      };
    }),
    total: Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id == id);
      return sum + product.price * qty;
    }, 0),
  };

  // Lưu vào Firebase (uncomment khi có config thực tế)
  // saveOrderToFirebase(currentOrder);

  // Tạo hóa đơn
  generateInvoice();
  showPage("invoicePage");

  // Reset giỏ hàng
  cart = {};
  updateCartDisplay();

  showNotification("Đặt hàng thành công!", "success");
}

// Tạo hóa đơn
function generateInvoice() {
  if (!currentOrder) return;

  document.getElementById(
    "invoiceNumber"
  ).textContent = `#${currentOrder.orderId}`;
  document.getElementById("trackingNumber").textContent =
    currentOrder.trackingCode;

  const paymentMethods = {
    cod: "Thanh toán khi nhận hàng (COD)",
    bank: "Chuyển khoản ngân hàng",
    card: "Thẻ tín dụng",
    momo: "Ví MoMo",
  };

  document.getElementById("invoiceDetails").innerHTML = `
          <div class="detail-row">
              <span class="detail-label">📅 Ngày đặt hàng:</span>
              <span>${currentOrder.orderDate}</span>
          </div>
          <div class="detail-row">
              <span class="detail-label">👤 Người nhận:</span>
              <span>${currentOrder.shippingInfo.fullName}</span>
          </div>
          <div class="detail-row">
              <span class="detail-label">📱 Điện thoại:</span>
              <span>${currentOrder.shippingInfo.phoneNumber}</span>
          </div>
          <div class="detail-row">
              <span class="detail-label">📍 Địa chỉ:</span>
              <span>${currentOrder.shippingInfo.address}</span>
          </div>
          <div class="detail-row">
              <span class="detail-label">💳 Thanh toán:</span>
              <span>${
                paymentMethods[currentOrder.shippingInfo.paymentMethod]
              }</span>
          </div>
      `;

  document.getElementById("invoiceItems").innerHTML = `
          <h4 style="margin-bottom: 15px; color: #2c3e50;">📋 Chi tiết đơn hàng:</h4>
          ${currentOrder.items
            .map(
              (item) => `
              <div class="item-row">
                  <div class="item-name">${item.emoji} ${item.name}</div>
                  <div class="item-quantity">x${item.quantity}</div>
                  <div class="item-price">${formatPrice(item.total)}</div>
              </div>
          `
            )
            .join("")}
      `;

  document.getElementById("invoiceTotal").innerHTML = `
          <div style="font-size: 16px; margin-bottom: 5px;">Tổng cộng:</div>
          <div class="total-amount">${formatPrice(currentOrder.total)}</div>
      `;
}

// Lưu đơn hàng vào Firebase
function saveOrderToFirebase(order) {
  // Uncomment khi có Firebase config thực tế
  /*
      const orderRef = database.ref('orders').push();
      orderRef.set({
          order_id: order.orderId,
          tracking_code: order.trackingCode,
          order_date: order.orderDate,
          customer_info: {
              full_name: order.shippingInfo.fullName,
              phone_number: order.shippingInfo.phoneNumber,
              delivery_address: order.shippingInfo.address,
              payment_method: order.shippingInfo.paymentMethod
          },
          order_items: order.items.map(item => ({
              product_id: item.id,
              product_name: item.name,
              product_emoji: item.emoji,
              unit_price: item.price,
              quantity: item.quantity,
              total_price: item.total
          })),
          order_total: order.total,
          order_status: 'pending',
          created_at: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
          console.log('Order saved to Firebase successfully');
      }).catch((error) => {
          console.error('Error saving order to Firebase:', error);
      });
      */
}

// Tạo mã đơn hàng
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `MS${year}${month}${day}${random}`;
}

// Tạo mã vận đơn
function generateTrackingCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";

  // 2 chữ cái đầu
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // 8 số
  for (let i = 0; i < 8; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // 2 chữ cái cuối
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return result;
}

// Hiển thị modal
function showModal(content, confirmCallback) {
  document.getElementById("modalContent").innerHTML = content;
  document.getElementById("confirmModal").style.display = "block";
  document.getElementById("confirmBtn").onclick = confirmCallback;
}

// Đóng modal
function closeModal() {
  document.getElementById("confirmModal").style.display = "none";
}

// Hiển thị thông báo
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 100);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// Tải hóa đơn
function downloadInvoice() {
  if (!currentOrder) return;

  const invoiceContent = `
MODERN SUPERMARKET - Hà Vũ Lâm
HÓA ĐƠN ĐIỆN TỬ

Số hóa đơn: #${currentOrder.orderId}
Ngày: ${currentOrder.orderDate}
Mã vận đơn: ${currentOrder.trackingCode}

THÔNG TIN KHÁCH HÀNG:
- Họ tên: ${currentOrder.shippingInfo.fullName}
- Điện thoại: ${currentOrder.shippingInfo.phoneNumber}
- Địa chỉ: ${currentOrder.shippingInfo.address}

CHI TIẾT ĐỚN HÀNG:
${currentOrder.items
  .map((item) => `${item.name} x${item.quantity} = ${formatPrice(item.total)}`)
  .join("\n")}

TỔNG TIỀN: ${formatPrice(currentOrder.total)}

Cảm ơn bạn đã mua hàng!
      `;

  const blob = new Blob([invoiceContent], {
    type: "text/plain;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hoadon_${currentOrder.orderId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showNotification("Đã tải hóa đơn!", "success");
}

// Quay lại mua hàng
function backToShopping() {
  showPage("productPage");
  currentOrder = null;
}

// Hiển thị giỏ hàng (có thể mở rộng thành modal)
function showCart() {
  if (Object.keys(cart).length === 0) {
    showNotification("Giỏ hàng trống!", "error");
    return;
  }

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id == id);
      return `${product.emoji} ${product.name} x${qty} = ${formatPrice(
        product.price * qty
      )}`;
    })
    .join("<br>");

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id == id);
    return sum + product.price * qty;
  }, 0);

  showModal(
    `
          <h3 style="text-align: center; margin-bottom: 20px; color: #2c3e50;">
              🛍️ Giỏ hàng của bạn
          </h3>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
              ${cartItems}
          </div>
          <div style="text-align: center; font-size: 18px; font-weight: 700; color: #e74c3c;">
              Tổng tiền: ${formatPrice(total)}
          </div>
      `,
    () => {
      closeModal();
    }
  );
}

// Đóng modal khi click bên ngoài
window.onclick = function (event) {
  const modal = document.getElementById("confirmModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Khởi tạo trang khi load
document.addEventListener("DOMContentLoaded", initializePage);
