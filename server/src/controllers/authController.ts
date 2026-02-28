import {Request, Response  } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, password, name, role } =req.body;
        //if user exists
        const existingUser = await prisma.user.findUnique({where:{email}});
        if(existingUser){
            res.status(400).json({error: 'User already exists'});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'CUSTOMER',
            },
        });
        res.status(201).json({message: 'User Registered Successfully', userId: user.id})
    }
    catch(error){
        res.status(500).json({error: 'Registration failed'});
    }
};

export const login = async (req: Request, res: Response): Promise<void> =>{
    try{
        const {email, password} = req.body;
        //finding user
        const user = await prisma.user.findUnique({where: { email}});
        if(!user){
            res.status(400).json({error: 'Invalid credentials'});
            return;
        }

        //compare password

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({error: 'Invalid credentials'});
            return;
        }

        //generate token
        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'}
        );
        res.json({token, user:{id: user.id, name: user.name, role: user.role}});
    }catch (error){
        res.status(500).json({error: 'Login failed'});
    }
};

// GET /api/auth/me - Get current logged-in user
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true } 
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

// PATCH /api/auth/profile - Update user info
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, password } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Prepare update data
    const updateData: any = { name };
    
    // Hash new password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true } // Return safe fields
    });

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};