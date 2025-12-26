import { Request, Response } from "express";
import { userService } from "./user.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.signupUser(req.body);
    console.log(result);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  signupUser,
};
