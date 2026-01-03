require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PreOrder = require('./models/PreOrder');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

   mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


app.post('/api/preorder', async (req, res) => {
    try {
        const order = new PreOrder(req.body);
        await order.save();
        res.json({ message: 'Đặt trước thành công! ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lưu đơn hàng' });
    }
});

app.get('/api/preorders', async (req, res) => {
    try {
        const orders = await PreOrder.find().sort({ createdAt: -1 });
        console.log('Orders:', orders);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
    }
});

app.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));