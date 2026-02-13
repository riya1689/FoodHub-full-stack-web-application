import express from 'express';
import { getAllProviders, getProviderById } from '../controllers/providerController';

const router = express.Router();

router.get('/providers', getAllProviders);

router.get('/providers/:id', getProviderById);

export default router;