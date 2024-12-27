import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("bills", function(table) {
        table.dropColumn("concept_id");
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("bills", function(table) {
        table.integer("concept_id").unsigned();
      });
}

