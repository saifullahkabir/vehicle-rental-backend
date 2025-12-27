import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
const port = 5000;

app.use(express.json());

// initializing DB
initDB();

// auth
app.use("/api/v1/auth", authRoute);

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
