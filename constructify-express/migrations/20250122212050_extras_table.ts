import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("extras", function (table) {
        table.increments("id").primary(); // Clave primaria autoincremental de la fila
    
        //referencia al "id" de la tabla "concepts".
        table
          .integer("concept_id")
          .unsigned()
          .references("id")
          .inTable("concepts")
          .onDelete("CASCADE") // si borras los conceptos, se borran sus extras
          .onUpdate("CASCADE"); // si cambias el id de los conceptos, se actualiza aquí
    
        // Campos adicionales
        table.string("iva");
        table.decimal("previous_bill", 10, 2);
        table.decimal("desc_previous_bill", 10, 2);
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("extras");
}

