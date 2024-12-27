import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bills', function(table) {
        table.increments('id').primary(); // Clave primaria autoincremental
        table.string('name'); // Nombre
        table.string('cif'); // CIF (Identificación fiscal)
        table.string('address'); // Dirección
        table.string('phone_number'); // Número de teléfono
        table.string('payment_type'); // Tipo de pago
        table.string('account_number'); // Número de cuenta
        table.string('bank'); // Banco
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp de creación
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp de última actualización
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('bills');
}
