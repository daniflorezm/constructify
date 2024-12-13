/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('bills', (table) => {
        table.increments('id').primary(); // ID autoincremental
        table.string('concepto'); 
        table.decimal('ml'); 
        table.decimal('m2'); 
        table.decimal('jornales'); 
        table.decimal('horas');
        table.decimal('unidad'); 
        table.decimal('valor_por_unidad'); 
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('items');
};
