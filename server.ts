require("dotenv").config();
import { app } from "./app";
import connectDB from "./utils/db";

app.listen(process.env.PORT, async () => {
  console.log(`Server is connected on ${process.env.PORT}`);
  await connectDB();
});
