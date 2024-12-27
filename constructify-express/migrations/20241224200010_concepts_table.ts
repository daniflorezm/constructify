import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("concepts", function (table) {
    table.increments("id").primary(); // Clave primaria autoincremental de la fila

    //referencia al "id" de la tabla "bills".
    table
      .integer("bill_id")
      .unsigned()
      .references("id")
      .inTable("bills")
      .onDelete("CASCADE") // si borras la factura, se borran sus conceptos
      .onUpdate("CASCADE"); // si cambias el id de la factura, se actualiza aquí

    // Campos adicionales
    table.string("concept");
    table.decimal("ml", 10, 2);
    table.decimal("metro_cuadrado", 10, 2);
    table.decimal("jornales", 10, 2);
    table.decimal("horas", 10, 2);
    table.string("und");
    table.decimal("valor_por_unidad", 10, 2);
    table.decimal("total", 10, 2);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("concepts");
}
