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