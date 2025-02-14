import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("concepts", function(table) {
        table.dropColumn("iva");
        table.dropColumn("previous_bill");
        table.dropColumn("desc_previous_bill");
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("concepts", function(table) {
        table.integer("iva").unsigned();
        table.integer("previous_bill").unsigned();
        table.integer("desc_previous_bill").unsigned();
      });
}

