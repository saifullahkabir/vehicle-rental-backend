import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { userRoute } from "./modules/user/user.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { bookingRoute } from "./modules/booking/booking.route";

const app = express();

app.use(express.json());

// initializing DB
initDB();

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route of vehicle rental server",
    path: req.path,
  });
})

// auth
app.use("/api/v1/auth", authRoute);

// users
app.use("/api/v1/users", userRoute);

// vehicles
app.use("/api/v1/vehicles", vehicleRoute);

// bookings
app.use("/api/v1/bookings", bookingRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

;

export default app;
