import express from "express";
import knexdb from "../knex/knexdatabase";
import path from "path";
import fs from "fs";
import archiver from "archiver";

export const getAllBills = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const items = await knexdb("bills")
      .select("*")
      .where("quarter", req.params.quarter);
    res.json(items);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Error al obtener los registros de las facturas",
      details: (err as Error).message,
    });
  }
};

export const getBillById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const billData = await knexdb("bills")
      .select("*")
      .where("id", req.params.billId);
    const conceptData = await knexdb("concepts")
      .select("*")
      .where("bill_id", req.params.billId);
    const extraData = await knexdb("extras")
      .select("*")
      .where("bill_id", req.params.billId);
    res.json({ bill: billData, concept: conceptData, extra: extraData });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: `Error al obtener los detalles de la factura con id: ${req.params.billId}`,
      details: (err as Error).message,
    });
  }
};
export const getXlsx = async (req: express.Request, res: express.Response) => {
  const filePath = path.join(
    __dirname,
    `../exports-xlsx/factura_${req.params.billId}.xlsx`
  );
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Archivo Excel no encontrado." });
  }
};

export const getPdf = async (req: express.Request, res: express.Response) => {
  const filePath = path.join(
    __dirname,
    `../exports-pdf/factura_${req.params.billId}.pdf`
  );
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Archivo PDF no encontrado." });
  }
};
export const getPng = async (req: express.Request, res: express.Response) => {
  const filePath = path.join(
    __dirname,
    `../exports-png/factura_${req.params.billId}.png`
  );
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Archivo PNG no encontrado." });
  }
};
export const getQuarterBills = async (
  req: express.Request,
  res: express.Response
) : Promise<any> => {
  try {
    const { quarter } = req.params;
    const quarterBills = await knexdb("bills").select("*").where("quarter", quarter).whereNot("tag", "PLANTILLA");

    if (quarterBills.length === 0) {
      return res.status(404).json({ error: "No hay facturas para este trimestre." });
    }

    // 📌 Verificar si la carpeta 'exports-zip' existe, si no, crearla
    const zipDir = path.join(__dirname, "../exports-zip");
    if (!fs.existsSync(zipDir)) {
      fs.mkdirSync(zipDir, { recursive: true }); // 🔹 Esto crea la carpeta si no existe
    }

    const zipFileName = `facturas_trimestre_${quarter}.zip`;
    const zipFilePath = path.join(zipDir, zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    for (const bill of quarterBills) {
      const pdfPath = path.join(__dirname, `../exports-pdf/factura_${bill.id}.pdf`);
      const excelPath = path.join(__dirname, `../exports-xlsx/factura_${bill.id}.xlsx`);

      if (fs.existsSync(pdfPath)) {
        archive.file(pdfPath, { name: `pdf/factura_${bill.id}.pdf` });
      }
      if (fs.existsSync(excelPath)) {
        archive.file(excelPath, { name: `excel/factura_${bill.id}.xlsx` });
      }
    }

    // 💡 Esperar a que el ZIP se complete antes de enviarlo
    output.on("close", () => {
      console.log(`ZIP creado: ${archive.pointer()} bytes`);

      // Enviar el archivo ZIP después de finalizar la compresión
      res.download(zipFilePath, zipFileName, (err) => {
        if (err) {
          console.error("Error al enviar el ZIP:", err);
          return res.status(500).json({ error: "No se pudo enviar el archivo ZIP." });
        }

        // Eliminar el archivo ZIP después de que se haya enviado
        fs.unlink(zipFilePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error al eliminar el ZIP:", unlinkErr);
        });
      });
    });

    archive.on("error", (err) => {
      console.error("Error al generar ZIP:", err);
      res.status(500).json({ error: "Error al generar ZIP", details: err.message });
    });

    archive.finalize(); // 🔹 Cierra correctamente el ZIP antes de enviarlo

  } catch (err) {
    console.error("Error general:", err);
    res.status(500).json({ error: "Error en el servidor", details: (err as Error).message });
  }
};
