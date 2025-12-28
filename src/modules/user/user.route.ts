import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin"), userController.getAllUsers);
router.put("/:userId", auth("admin", "customer"), userController.updateUser);

export const userRoute = router;
