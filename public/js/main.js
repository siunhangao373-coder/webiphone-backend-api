function scrollToForm() {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ===== BẢNG GIÁ =====
const priceTable = {
  "Pro": {
    "256": 25990000,
    "512": 29990000,
    "1024": 33990000
  },
  "Pro Max": {
    "256": 29990000,
    "512": 33990000,
    "1024": 37990000
  }
};

const versionEl = document.getElementById('version');
const storageEl = document.getElementById('storage');
const priceEl = document.getElementById('price');
const message = document.getElementById('message');

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + '₫';
}

function updatePrice() {
  const version = versionEl.value;
  const storage = storageEl.value;

  if (version && storage) {
    priceEl.textContent = formatPrice(priceTable[version][storage]);
  } else {
    priceEl.textContent = '---';
  }
}

versionEl.addEventListener('change', updatePrice);
storageEl.addEventListener('change', updatePrice);

// ===== VALIDATE & SUBMIT FORM =====
document.getElementById('orderForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const version = versionEl.value;
  const storage = storageEl.value;

  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 3) return showError("Họ tên phải ít nhất 3 ký tự !");
  if (!phoneRegex.test(phone)) return showError("Số điện thoại không hợp lệ!");
  if (!emailRegex.test(email)) return showError("Email không hợp lệ!");
  if (!address) return showError("Vui lòng nhập địa chỉ!");
  if (!version || !storage) return showError("Vui lòng chọn phiên bản và dung lượng!");

  const price = priceTable[version][storage];

  try {
    const res = await fetch('http://localhost:3000/api/preorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        address,
        version,
        storage,
        price
      })
    });

    const data = await res.json();
    message.textContent = data.message;
    message.style.color = 'green';

    this.reset();
    priceEl.textContent = '---';

  } catch (err) {
    showError("Lỗi gửi đơn đặt trước");
  }
});

function showError(text) {
  message.textContent =  text;
  message.style.color = 'red';
}
