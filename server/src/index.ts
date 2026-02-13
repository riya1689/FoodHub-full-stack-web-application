import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import mealRoutes from './routes/mealRoutes';
import providerRoutes from './routes/providerRoutes';
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('FoodHub API is running...');
});

export default app;
