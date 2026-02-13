import { Request, Response, NextFunction} from 'express';

export const authorizeRole = (allowedRoles: string[]) =>{
    return (req: Request, res: Response, next: NextFunction) =>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            res.status(403).json({error: 'Access denied. Insufficient permission.'})
            return;
        }
        next();
    };
    
};