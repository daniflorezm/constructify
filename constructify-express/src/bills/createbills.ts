import express from "express";
import knexdb from "../knex/knexdatabase";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export const createBill = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      name,
      cif,
      address,
      phone_number,
      payment_type,
      account_number,
      bank,
      concepts
    } = req.body;
    const [newBillId] = await knexdb("bills").insert({
      name,
      cif,
      address,
      phone_number,
      payment_type,
      account_number,
      bank,
      created_at: new Date(),
      updated_at: new Date(),
    });
    interface Concept {
      concept: string;
      ml?: number;
      metro_cuadrado?: number;
      jornales?: number;
      horas?: number;
      und?: string;
      valor_por_unidad?: number;
      total?: number;
    }
    if (req.body.concepts && Array.isArray(req.body.concepts)) {
      const conceptsData = req.body.concepts.map((concept: Concept) => ({
        bill_id: newBillId,
        concept: concept.concept,
        ml: concept.ml || 0,
        metro_cuadrado: concept.metro_cuadrado || 0,
        jornales: concept.jornales || 0,
        horas: concept.horas || 0,
        und: concept.und || "",
        valor_por_unidad: concept.valor_por_unidad || 0,
        total: (concept.ml || 0) * (concept.valor_por_unidad || 0), // Calcular total
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await knexdb("concepts").insert(conceptsData);
    }
    // 2️⃣ Obtener los datos de la nueva factura
    const newBill = await knexdb("bills").where("id", newBillId).first();
    const newConcepts = await knexdb("concepts").where("bill_id", newBillId);

    if (!newBill) {
      throw new Error(
        "No se pudo obtener la nueva factura de la base de datos."
      );
    } else if (!concepts) {
      throw new Error(
        "No se pudieron obtener los conceptos de la base de datos."
      );
    }

    // 3️⃣ Cargar la plantilla de Excel
    const templatePath = path.join(
      __dirname,
      "../xlsxtemplate/invoice_template.xlsx"
    );
    const outputPath = path.join(
      __dirname,
      `../exports/factura_${newBillId}.xlsx`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(
        "La plantilla de factura no existe en la ruta especificada."
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1); // Usar la primera hoja del Excel
    if (!worksheet) {
      throw new Error(
        "No se pudo encontrar la primera hoja en la plantilla de Excel."
      );
    }

    function formatDate(timestamp: number): string {
      const date = new Date(timestamp);
      const day = date.getUTCDate();
      const month = date.toLocaleString("es-ES", { month: "long" });
      return `${day} de ${month}`;
    }

    // 4️⃣ Escribir los datos en la plantilla
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string") {
          cell.value = cell.value.replace("{{ID_FACTURA}}", newBill.id || "");
          cell.value = cell.value.replace("{{CLIENTE}}", newBill.name || "");
          cell.value = cell.value.replace("{{CIF}}", newBill.cif || "");
          cell.value = cell.value.replace(
            "{{DIRECCION}}",
            newBill.address || ""
          );
          cell.value = cell.value.replace(
            "{{TELEFONO}}",
            newBill.phone_number || ""
          );
          cell.value = cell.value.replace(
            "{{TIPO_PAGO}}",
            newBill.payment_type || ""
          );
          cell.value = cell.value.replace(
            "{{CUENTA_BANCO}}",
            newBill.account_number || ""
          );
          cell.value = cell.value.replace("{{BANCO}}", newBill.bank || "");
          cell.value = cell.value.replace("{{FECHA}}", "27 de Diciembre");
        }
      });
    });
    // Escribir conceptos en el Excel
    const startRow = 18; // Fila donde empiezan los conceptos
    newConcepts.forEach((concept, index) => {
      const currentRow = startRow + index; // Incrementa la fila por cada concepto

      worksheet.getCell(`A${currentRow}`).value = concept.concept || "";
      worksheet.getCell(`B${currentRow}`).value = concept.ml || 0;
      worksheet.getCell(`C${currentRow}`).value = concept.metro_cuadrado || 0;
      worksheet.getCell(`D${currentRow}`).value = concept.jornales || 0;
      worksheet.getCell(`E${currentRow}`).value = concept.horas || 0;
      worksheet.getCell(`F${currentRow}`).value = concept.und || "";
      worksheet.getCell(`G${currentRow}`).value = concept.valor_por_unidad || 0;
      worksheet.getCell(`H${currentRow}`).value = concept.total || 0;

      // Ajustar el formato de cada celda
      worksheet.getRow(currentRow).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getRow(currentRow).font = { name: "Aptos Narrow", size: 11 };
    });

    // 5️⃣ Guardar el nuevo archivo Excel
    await workbook.xlsx.writeFile(outputPath);

    res.status(201).json({
      message: "Factura creada con éxito y exportada a Excel",
      billId: newBillId,
      excelPath: outputPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error al crear la factura y exportarla a Excel",
      details: (err as Error).message,
    });
  }
};
