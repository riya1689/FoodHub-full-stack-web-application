import express,{Request, Response} from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import mealRoutes from './routes/mealRoutes';
import providerRoutes from './routes/providerRoutes';
import adminRoutes from './routes/adminRoutes';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meals',mealRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/',(req: Request, res: Response) => {
    res.send('FoodHub API is running...');
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});