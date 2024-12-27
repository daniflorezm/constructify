import express from "express";
import knexdb from "../knex/knexdatabase";

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const items = await knexdb("bills").select("*");
    res.json(items);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Error al obtener los registros de las facturas",
      details: (err as Error).message,
    });
  }
};
export const getById = async (req: express.Request, res: express.Response) => {
  const id = req.params.byId;
  res.status(200).json(["Recuperando por id", id]);
};
