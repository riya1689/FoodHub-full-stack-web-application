import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import mealRoutes from './routes/mealRoutes';
import providerRoutes from './routes/providerRoutes';
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';
import orderRoutes from './routes/orderRoutes';
import providerPrivateRoutes from './routes/providerPrivateRoutes';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/provider', providerPrivateRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('FoodHub API is running');
});

const port = process.env.PORT || 5000;

if(require.main === module){
    app.listen(port, ()=>{
        console.log(`FoodHub API is running on port ${port}`);
    });
}

export default app;
