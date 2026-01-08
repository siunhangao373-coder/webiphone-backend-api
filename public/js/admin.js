async function loadOrders() {
const API_BASE = 'https://webiphone-backend-api.onrender.com';

 try {
    const res = await fetch(`${API_BASE}/api/preorders`);
    const orders = await res.json();

const tbody = document.getElementById('orderList');
tbody.innerHTML = '';


orders.forEach(o => {
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${o.name}</td>
<td>${o.phone}</td>
<td>${o.email}</td>
<td>${o.address}</td>
<td>${o.version || '---'}</td> <!-- Phiên bản -->
<td>${o.storage ? (o.storage == 1024 ? '1TB' : o.storage + 'GB') : '---'}</td> <!-- Dung lượng -->
<td>${new Date(o.createdAt).toLocaleString()}</td>
`;
tbody.appendChild(tr);
});
}
 catch (error) {
  console.error('Lỗi tải đơn đặt trước:', error);
  alert('Không tải được dữ liệu đơn đặt trước. Vui lòng thử lại sau.');
}
}
loadOrders();