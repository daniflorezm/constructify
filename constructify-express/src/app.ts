import express, { json } from "express";
import api from "./routes/routes";

// Si el export de KnexDatabaseConfiguration sigue siendo por default, 
// basta con quitar la extensión .js y TypeScript lo leerá del .ts


const PORT = process.env.PORT || 3001;
const app = express();

app.use(json());
app.use('/api', api)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
