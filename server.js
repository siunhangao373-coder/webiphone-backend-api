require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const PreOrder = require('./models/PreOrder');

const app = express();
const PORT = process.env.PORT || 3000;

/* ========== MIDDLEWARE ========== */
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

/* ========== VIEW ROUTES ========== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

/* ========== DATABASE ========== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });

/* ========== API ========== */
app.post('/api/preorder', async (req, res) => {
  try {
    const { name, phone, email, address, version, storage } = req.body;

    // Validate backend 
    if (!name || !phone || !email || !address) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    const order = new PreOrder({
      name,
      phone,
      email,
      address,
      version,
      storage
    });

    await order.save();

    res.status(201).json({
      message: ' Đặt trước thành công!'
    });

  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({
      message: 'Lỗi server khi lưu đơn hàng'
    });
  }
});

app.get('/api/preorders', async (req, res) => {
  try {
    const orders = await PreOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi lấy danh sách đơn hàng'
    });
  }
});

/* ========== START SERVER ========== */
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});
