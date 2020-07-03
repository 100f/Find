const knex = require('../database');

const cloudinary = require('../config/cloudinary')
const fs = require('fs')

module.exports = {


    // Create service

    async create(request, response, next) {

        try {

            const uploader = async (path) => await cloudinary.uploads(path,'images')

            const urls = []

            const files = request.files

            for (const file of files) {
            
                const {path} = file

                const newPath = await uploader(path)

                urls.push(newPath)

                fs.unlinkSync(path)
            }

            const { name, description, price, id_company } = request.body;

            const item = [{ name, description, price,  id_company }];

            const service = item.map(element => {
                return {
                    "img_url": urls[0].url,
                    ...element
                }
            })

            await knex('services').insert(service);

            response.status(201).json(service);
        

        } catch (error) {
            next(error)
        }
    },


    // Listar serviço 

    async index(request, response, next) {

        try {

            const { id_company } = request.params; 

            const services = await knex('services').where({ id_company });

            response.json(services);

        
        } catch (error) {
            next(error)

        }

    },


    // Listar serviço na tela do cliente, 
    // classificar por empresa (tela 72)
    // Parte do cliente

    async show(request, response, next) {

        try {

            const { id_company } = request.query;

            const services = await knex('services')
            .where({ id_company })
            .select('id', 'img_url', 'name', 'description', 'price');

            const company = await knex('companies')
            .where('id', id_company)
            .select('img_url', 'name', 'address');

            const data = company.map(items => {

            return {
                "img_url": items.img_url,
                "title": items.name,
                "address": items.address,
                "services": services
            }

        });

        response.json(data);
        
        } catch (error) {
            next(error)
        }

    },


    //Listar um único serviço
    async getService(request, response, next){
        try{
            const { id } = request.params;

            const service = await knex('services').where({ id });

            response.json(service);

        }catch(error){
            next(error);
        }
    },


    // Atualizar dados de um serviço

    async update(request, response, next) { 

        try {
      
            const uploader = async (path) => await cloudinary.uploads(path,'images')

            const urls = []

            const files = request.files

            for (const file of files) {
            
                const {path} = file

                const newPath = await uploader(path)

                urls.push(newPath)

                fs.unlinkSync(path)
            }

            const { id } = request.params;

            const { name, description, price } = request.body;

            const item = [{ name, description, price }];
            
            const service = item.map(element => {
                return {
                    "img_url": urls[0].url,
                    ...element
                }
            })

            await knex('services')
            .where({ id })
            .update({ service});

            const newdata = await knex('services').where({ id })

            response.status(200).json(newdata)

        } catch (error) {
            next(error)
        }

    },


    // Deletar um serviço

    async delete(request, response, next) {

        try {
            const { id } = request.params;

            await knex('services').where('id', id).del();
  
            response.status(200).json({msg: 'Serviço deletado com sucesso!'});
        
        } catch (error) {
            next(error)
        }

    }




}