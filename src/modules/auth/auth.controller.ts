import { Request, Response } from "express";
import { authService } from "./auth.service";

//* signup
const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUser(req.body);
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

//*signin
const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signinUser(
      req.body.email,
      req.body.password
    );
    console.log(result);

    res.status(201).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signupUser,
  signinUser,
};
