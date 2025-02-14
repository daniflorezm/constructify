import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("bills", function (table) {
        table.integer("quarter")
        table.string("tag")
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("bills", function (table) {
        // Eliminar columnas nuevas en caso de rollback
        table.dropColumn("quarter");
        table.dropColumn("tag");
      });
}

