async function loadOrders() {
const res = await fetch('/api/preorders');
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
<td>${new Date(o.createdAt).toLocaleString()}</td>
`;
tbody.appendChild(tr);
});
}


loadOrders();