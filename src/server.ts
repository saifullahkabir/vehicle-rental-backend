import { vehicleService } from "./modules/vehicle/vehicle.service";
import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { userRoute } from "./modules/user/user.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";

const app = express();
const port = 5000;

app.use(express.json());

// initializing DB
initDB();

// auth
app.use("/api/v1/auth", authRoute);

// users
app.use("/api/v1/users", userRoute);

// vehicles
app.use("/api/v1/vehicles", vehicleRoute);

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route of vehicle rental server",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
