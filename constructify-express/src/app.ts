import express, { json } from "express";
import cors from "cors";
import api from "./routes/routes";
import path from "path";



const PORT = process.env.PORT || 3001;
const app = express();

app.use(json());
app.use(cors());
const buildPath = path.join(__dirname, "build");
app.use('/api', api)
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
