import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("extras", function (table) {
    table.dropColumn("concept_id");
    //referencia al "id" de la tabla "bills".
    table
      .integer("bill_id")
      .unsigned()
      .references("id")
      .inTable("bills")
      .onDelete("CASCADE") // si borras la factura, se borran sus extras
      .onUpdate("CASCADE"); // si cambias el id de la factura, se actualiza aquí
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("extras", function (table) {
    table.integer("concept_id").unsigned();
    table.dropColumn("bill_id");
  });
}
