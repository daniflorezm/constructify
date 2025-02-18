import express from "express";
import knexdb from "../knex/knexdatabase";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { exec, execSync } from "child_process";

interface Concept {
  concept?: string;
  ml?: number;
  metro_cuadrado?: number;
  jornales?: number;
  horas?: number;
  und?: string;
  valor_por_unidad?: number;
  total?: number;
}

interface Extra {
  iva?: number;
  previous_bill?: number;
  desc_previous_bill?: number;
}

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
      iva,
      previous_bill,
      desc_previous_bill,
      concepts,
      tag,
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
      tag,
    });

    await knexdb("extras").insert({
      bill_id: newBillId,
      iva,
      previous_bill,
      desc_previous_bill,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (Array.isArray(concepts) && concepts.length > 0) {
      const conceptsData = concepts.map((concept: Concept) => ({
        bill_id: newBillId,
        concept: concept.concept || "",
        ml: concept.ml || 0,
        metro_cuadrado: concept.metro_cuadrado || 0,
        jornales: concept.jornales || 0,
        horas: concept.horas || 0,
        und: concept.und || "",
        valor_por_unidad: concept.valor_por_unidad || 0,
        total: (concept.ml || 0) * (concept.valor_por_unidad || 0), 
        created_at: new Date(),
        updated_at: new Date(),
      }));
    
      await knexdb("concepts").insert(conceptsData);
    }

    // 2️⃣ Obtener los datos de la nueva factura
    const newBill = await knexdb("bills").where("id", newBillId).first();
    const newConcepts = await knexdb("concepts").where("bill_id", newBillId);
    const newExtras = await knexdb("extras")
      .where("bill_id", newBillId)
      .first();

    if (!newBill) {
      throw new Error(
        "No se pudo obtener la nueva factura de la base de datos."
      );
    } else if (!concepts) {
      throw new Error(
        "No se pudieron obtener los conceptos de la base de datos."
      );
    }

    // Asignar a un trimestre

    let quarter 
    const month = new Date(newBill.created_at).getMonth() + 1;
    if (month >= 1 && month <= 3) {
      quarter = 1;
    } else if (month >= 4 && month <= 6) {
      quarter = 2;
    } else if (month >= 7 && month <= 9) {
      quarter = 3;
    } else {
      quarter = 4;
    }
    await knexdb("bills").where("id", newBillId).update({ quarter: quarter });

    // 3️⃣ Cargar la plantilla de Excel
    const mainTemplate = path.join(
      __dirname,
      "../xlsxtemplate/invoice_template.xlsx"
    );
    const autonomoTemplate = path.join(
      __dirname,
      "../xlsxtemplate/autonomo_template.xlsx"
    );
    const templatePath = path.join(
      __dirname,
      "../xlsxtemplate/plantilla_template.xlsx"
    );
    let usedTemplate;
    if (tag == "MAIN") {
      usedTemplate = mainTemplate;
    } else if (tag == "AUTONOMO") {
      usedTemplate = autonomoTemplate;
    } else {
      usedTemplate = templatePath;
    }
    const xlsxOutputPath = path.join(
      __dirname,
      `../exports-xlsx/factura_${newBillId}.xlsx`
    );
    const pdfOutputPath = path.join(
      __dirname,
      `../exports-pdf/factura_${newBillId}.pdf`
    );
    const pngOutputPath = path.join(
      __dirname,
      `../exports-png/factura_${newBillId}.png`
    )

    const libreOfficePath = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;

    if (!fs.existsSync(usedTemplate)) {
      throw new Error(
        "La plantilla de factura no existe en la ruta especificada."
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(usedTemplate);
    const worksheet = workbook.getWorksheet(1); // Usar la primera hoja del Excel
    if (!worksheet) {
      throw new Error(
        "No se pudo encontrar la primera hoja en la plantilla de Excel."
      );
    }

    // Escribir conceptos en el Excel
    let startRow = 18; // Fila donde comienzan los conceptos
    const reservedRows = 2; // Número de filas reservadas al final

    let reservedStartRow = worksheet.actualRowCount - reservedRows + 1; // Fila donde comienzan las filas reservadas

    const requiredRows = startRow + newConcepts.length; // Fila requerida después de escribir todos los conceptos
    const rowsToAdd = requiredRows - reservedStartRow; // Número de filas que se deben insertar antes de las filas reservadas

    // Si se necesitan más filas, insertar solo las necesarias
    if (rowsToAdd > 0) {
      for (let i = 0; i < rowsToAdd; i++) {
        // Insertar una nueva fila en reservedStartRow
        worksheet.spliceRows(reservedStartRow, 0, []);

        // Copiar el formato de la fila 18 a la nueva fila
        const newRowIndex = reservedStartRow + i;
        const sourceRow = worksheet.getRow(18); // Fila base (18)
        const targetRow = worksheet.getRow(newRowIndex); // Fila recién creada

        // Copiar altura de la fila
        targetRow.height = sourceRow.height;

        // Recorrer celdas en la fila base y copiar formato
        sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const targetCell = targetRow.getCell(colNumber);

          // Copiar estilos de la celda base
          targetCell.style = { ...cell.style };
        });
      }
    }

    // Escribir los conceptos dinámicamente
    newConcepts.forEach((concept) => {
      const referenceRow = worksheet.getRow(18);
      const targetRow = worksheet.getRow(startRow);
  
      targetRow.height = referenceRow.height;
    
      referenceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const targetCell = targetRow.getCell(colNumber);
        targetCell.style = { ...cell.style };
      });
      worksheet.getCell(`A${startRow}`).value = concept.concept || "";
      worksheet.getCell(`B${startRow}`).value = concept.ml || 0;
      worksheet.getCell(`C${startRow}`).value = concept.metro_cuadrado || 0;
      worksheet.getCell(`D${startRow}`).value = concept.jornales || 0;
      worksheet.getCell(`E${startRow}`).value = concept.horas || 0;
      worksheet.getCell(`F${startRow}`).value = concept.und || "";
      worksheet.getCell(`G${startRow}`).value = concept.valor_por_unidad || 0;
      worksheet.getCell(`H${startRow}`).value = concept.total || 0;

      // Incrementar la fila actual para el próximo concepto
      startRow++;
    });

    function formatDate(dateValue: string | Date | number): string {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return "";
      }
      const day = date.getDate();
      const month = date.toLocaleString("es-ES", { month: "long" });
      const year = date.getFullYear();

      return `${day} de ${month} de ${year}`;
    }

    // Calculos de la factura

    const total_factura = newConcepts
      .reduce((acc, concept) => {
        return acc + (concept.total || 0);
      }, 0)
      .toFixed(2);
    const subtotal: number = parseFloat(
      (total_factura - newExtras.previous_bill).toFixed(2)
    );
    const calc_desc: number = parseFloat(
      ((newExtras.desc_previous_bill * subtotal) / 100).toFixed(2)
    );
    const base: number = parseFloat((subtotal - calc_desc).toFixed(2));
    const calc_iva: number = parseFloat(
      ((base * newExtras.iva) / 100).toFixed(2)
    );
    const total_def: number = parseFloat((base + calc_iva).toFixed(2));
    

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
          cell.value = cell.value.replace(
            "{{FECHA}}",
            formatDate(newBill.created_at)
          );
          cell.value = cell.value.replace("{{IVA}}", newExtras.iva || 0);
          cell.value = cell.value.replace(
            "{{PREV_BILL}}",
            newExtras.previous_bill || 0
          );
          cell.value = cell.value.replace(
            "{{DESC_BILL}}",
            newExtras.desc_previous_bill || 0
          );
          cell.value = cell.value.replace(
            "{{TOTAL_FACTURA}}",
            total_factura || 0
          );
          cell.value = cell.value.replace(
            "{{SUBTOTAL}}",
            String(subtotal || 0)
          );
          cell.value = cell.value.replace(
            "{{CALC_DESC}}",
            String(calc_desc || 0)
          );
          cell.value = cell.value.replace("{{BASE}}", String(base || 0));
          cell.value = cell.value.replace(
            "{{CALC_IVA}}",
            String(calc_iva || 0)
          );
          cell.value = cell.value.replace(
            "{{TOTAL_DEF}}",
            String(total_def || 0)
          );
        }
      });
    });

    await workbook.xlsx.writeFile(xlsxOutputPath);

    if (!fs.existsSync(xlsxOutputPath)) {
      throw new Error("ERROR: El archivo Excel no se guardó correctamente.");
    }
    
    const pdfCommand = `${libreOfficePath} --headless --convert-to pdf --outdir "${path.dirname(pdfOutputPath)}" "${xlsxOutputPath}"`;
    execSync(pdfCommand);
    
    if (!fs.existsSync(pdfOutputPath)) {
      throw new Error("ERROR: El archivo PDF no se generó correctamente.");
    }

    const pngCommand = `${libreOfficePath} --headless --convert-to png --outdir "${path.dirname(pngOutputPath)}" "${pdfOutputPath}"`;
    execSync(pngCommand);
    
    if (!fs.existsSync(pngOutputPath)) {
      throw new Error("ERROR: El archivo PNG no se generó correctamente.");
    }
    
    res.json({ success: true, billId: newBillId });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error al crear la factura",
      details: (err as Error).message,
    });
  }
};
