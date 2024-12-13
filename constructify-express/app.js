// server/index.js

const express = require("express");
const knex = require('knex');
const KnexDatabaseConfiguration = require('./KnexDatabaseConfiguration');

const db = knex(KnexDatabaseConfiguration);


const PORT = process.env.PORT || 3001;
const app = express();

// Middleware para manejar JSON
app.use(express.json());

app.get('/api/list-bill', async (req, res) => {
  try {
    // Consulta para obtener todos los registros de la tabla 'items'
    const items = await db('bills').select('*');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

app.post('/api/create-bill', async (req, res) => {
  try {
    const { name, price } = req.body;
    // Inserción de un nuevo item en la base de datos
    await db('bills').insert({ concepto, ml, m2, jornales, horas, unidad, valor_por_unidad });
    res.status(201).json({ message: 'Item agregado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el item' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});