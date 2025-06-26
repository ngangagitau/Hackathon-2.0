import express from 'express';
import Service from '../models/Service.js';
import { verifyToken } from '../middleware/auth.js';
import paymentRoutes from './routes/payments.js';
app.use('/api/pay', paymentRoutes);


const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  const services = await Service.find().populate('user', 'name location');
  res.json(services);
});

// Create new service
router.post('/', verifyToken, async (req, res) => {
  const { title, description, category, priceRange, location } = req.body;
  const service = new Service({
    title,
    description,
    category,
    priceRange,
    location,
    user: req.user.id,
  });
  await service.save();
  res.status(201).json(service);
});

export default router;
