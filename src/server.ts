import express, { Request, Response } from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route of vehicle rental server",
    path: req.path,
  });
});



app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
