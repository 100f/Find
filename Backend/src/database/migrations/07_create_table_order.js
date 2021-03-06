exports.up = knex => knex.schema.createTable('orders', table => {

    table.increments('id')
    table.integer('id_client').references('clients.id').notNullable().onDelete()
    table.integer('id_company').references('companies.id').notNullable().onDelete()
    table.integer('id_address').references('addresses.id').nullable().onDelete()
    table.decimal('total', 5, 2).nullable()
    table.enu('payment', ['Cartão', 'Dinheiro']).notNullable()
    table.enu('receivement', ['Entregar', 'Retirar']).notNullable()
    table.enu('status', ['Solicitado', 'Cancelado', 'Finalizado', 'Fazendo']).defaultTo('Solicitado')
    table.timestamp('order_date').defaultTo(knex.fn.now())

})


exports.down = knex => knex.schema.dropTable('orders')