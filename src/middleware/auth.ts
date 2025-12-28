import { NextFunction, Request, Response } from "express";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log();
    }
};

export default auth;
