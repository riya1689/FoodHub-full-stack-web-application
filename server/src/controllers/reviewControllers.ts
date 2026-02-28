import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.userId;
    const { mealId, rating, comment } = req.body;

    if (!customerId) {
      res.status(401).json({ error: "Unauthorized" }); 
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Please provide a valid rating between 1 and 5." });
      return;
    }

    // Security Check: Verify the user ordered this meal AND the order is DELIVERED
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        mealId: Number(mealId),
        order: {
          customerId: customerId,
          status: 'DELIVERED'
        }
      }
    });

    if (!hasOrdered) {
      res.status(403).json({ error: "You can only review meals from completed deliveries." }); 
      return;
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        customerId,
        mealId: Number(mealId)
      }
    });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};