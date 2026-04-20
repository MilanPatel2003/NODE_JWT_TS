import { Request, Response } from "express";

export const allAccess = async (req:Request,res:Response) => {
    res.status(200).send("PUBLIC CONTENT....")
    
}
export const userAccess = async (req:Request,res:Response) => {
    res.status(200).send("USER CONTENT....")
    
}
export const adminAccess = async (req:Request,res:Response) => {
    res.status(200).send("ADMIN CONTENT....")   
    
}