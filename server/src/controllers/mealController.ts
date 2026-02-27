import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../db';

//get all meals

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        category: true, // <-- MUST INCLUDE CATEGORY
        provider: {     // <-- MUST INCLUDE PROVIDER
          include: {
            user: true  // Includes the restaurant's User name if needed
          }
        }
      }
    });
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
};

//Add a meal (only provider)

export const addMeal = async (req: Request, res: Response) => {
  try {
    const { name, description, price, categoryId, providerId, imageUrl } = req.body;

    if (!name || !price || !categoryId || !providerId) {
       res.status(400).json({ error: "Missing required fields" });
       return;
    }
    
    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: Number(categoryId),
        providerId: Number(providerId),
        imageUrl: imageUrl || null
      }
    });
    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add meal' });
  }
};

export const getMealById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const meal = await prisma.meal.findUnique({
            where: { id: Number(id) },
            include: { provider: true, category: true }
        });
        if (!meal) {
            res.status(404).json({ error: "Meal not found" });
            return; 
        }
        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: "Error fetching meal" });
    }
};