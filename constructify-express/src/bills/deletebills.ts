import express from "express";
import knexdb from "../knex/knexdatabase";

export const deleteBill = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const items = await knexdb("bills")
        .where("id", req.params.id).del();
      res.json(items);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({
        error: "Error al eliminar registros de las facturas",
        details: (err as Error).message,
      });
    }
  };
  export const deleteQuarterBills = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const items = await knexdb("bills")
        .where("quarter", req.params.quarter).del();
      res.json(items);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({
        error: "Error al eliminar registros de las facturas trimestrales",
        details: (err as Error).message,
      });
    }
  };