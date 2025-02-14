import express, { json } from "express";
import cors from "cors";
import api from "./routes/routes";



const PORT = process.env.PORT || 3001;
const app = express();

app.use(json());
app.use(cors());
app.use('/api', api)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
