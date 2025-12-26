import express, { Request, Response } from "express";
import initDB from "./config/db";

const app = express();
const port = 5000;

app.use(express.json());

// initializing DB
initDB();

app.post("/users", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route of vehicle rental server",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
