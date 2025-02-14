import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("concepts", function (table) {
    table.decimal("previous_bill", 10, 2)
    table.decimal("desc_previous_bill", 10, 2)
    table.decimal("iva", 10, 2)
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("concepts", function (table) {
        // Eliminar columnas nuevas en caso de rollback
        table.dropColumn("previous_bill");
        table.dropColumn("desc_previous_bill");
        table.dropColumn("iva");
      });
}
