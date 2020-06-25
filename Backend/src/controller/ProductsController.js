const knex = require('../database');
const { select } = require('../database');

module.exports = {

    // Add produtos

    async create(request, response, next) {

        try {

        const { name, description, price, img_url, limit_time, id_company } = request.body;

            const item = { name, description, price, img_url, limit_time, id_company };

            await knex('products').insert(item);

            response.json(item);
            

        } catch (error) {
            
            response.status(404).send()
            next(error)
        }
    },


    // Listar produtos 

    async index(request, response, next) {

        try {

            const { id_company } = request.params; 
    
            const products = await knex('products').where({ id_company });
    
            return response.json(products);

            
        } catch (error) {
            response.status(404).send()
            next(error)

        }


    },

    
    // Listar produtos na tela do cliente, 
    // classificar por empresa (tela 28)
    // Parte do cliente

    async show(request, response, next) {

        try {

            const { id_company } = request.query;

            const product = await knex('products')
            .where({ id_company })
            .select('id', 'img_url', 'name', 'description', 'price');

            const company = await knex('company')
            .where('id', id_company)
            .select('img_url', 'name', 'address');

            const mixed = company.map(items => {

                return {
                    "img_url": items.img_url,
                    "title": items.name,
                    "address": items.address,
                    product
                }

            });

            return response.json(mixed);
            
        } catch (error) {
            response.status(403).send()
            next(error)

        }

    },


    // Atualizar dados de um produto

    async update(request, response, next) { 

        try {
          
            const { id } = request.params;

            const { img_url, name, description, price, limit_time } = request.body;

            await knex('products')
            .where({ id })
            .update({img_url, name, description, price, limit_time});

            const newdata = await knex('products').where({ id })

            return response.json(newdata)

        } catch (error) {
            response.status(403).send()
            next(error)
        }

    },



    // Deletar um produto

    async delete(request, response, next) {

        try {
            const { id } = request.params;
    
            await knex('products').where('id', id).del();
      
            return response.json({msg: 'product successfully deleted!'});
            
        } catch (error) {
            response.status(403).send()
            next(error)
        }

    }

}