import { Request, Response } from 'express';
import knex from '../database/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv/config');

class UserController{

    async create(req:Request, res:Response){
        const {
            email,
            senha,
            nome,
            whatsapp,
            categoria,
            localizacao,
            data_nascimento,
            veiculo_midia,
            semanas_gestante,
            data_provavel_parto,
            companheiro,
            data_parto,
            semanas_gestacao,
            cidade,
            estado,
            bebes
        } = req.body;

        await knex.transaction(async trx =>{

            const mae = {
                email, 
                senha:await bcrypt.hash(senha,10), 
                nome, 
                localizacao, 
                data_nascimento, 
                ultimo_acesso:new Date(), 
                primeiro_acesso: new Date(), 
                categoria, 
                whatsapp, 
                veiculo_midia,
                semanas_gestante,
                companheiro: companheiro || false,
                data_provavel_parto,
                data_parto,
                semanas_gestacao,
                cidade_estado: `${cidade} - ${estado}`
            };

            const [id] = await trx('mae').insert(mae).returning('id')

            if(bebes){
                for (const bebe of bebes) {
                    const {
                        nome,
                        local_nascimento,
                        local_atual,
                        instituicao
                    } =  bebe
                    const bebeCadastro = {
                        nome,
                        mae_id: id,
                        local_cadastro: local_nascimento,
                        local: local_atual,
                        instituicao
                    };
                    await trx('bebe').insert(bebeCadastro);
                }
            }

            const secret = process.env.SECRET
            const token = jwt.sign({id},secret?secret:"segredo",{
                    expiresIn:3600
            })
            res.json({token})
        })
    }

    async update(req:Request, res:Response){
        const {
            email,
            nome,
            whatsapp,
            data_nascimento,
            data_provavel_parto,
            companheiro,
            cidade,
            estado,
            bebes
        } = req.body;

        const { mae_id } = req;

        await knex.transaction(async trx =>{

            const mae = {email, nome, companheiro, data_nascimento, whatsapp, data_provavel_parto, cidade_estado: `${cidade} - ${estado}`};
            await trx('mae').where({id: mae_id}).update(mae);

            if(bebes){
                for (let bebe of bebes) {
                    bebe.local_cadastro = bebe.local_nascimento
                    bebe.local = bebe.local_atual
                    const { id, local_nascimento, local_atual, ...bebeUpdate} = bebe;
                    await trx('bebe').where({mae_id}).andWhere({id}).update(bebeUpdate);
                }
            }
        });

        const result = await knex('mae')
        .select('*')
        .where('mae.id',mae_id).first()

        result['senha'] = null;

        result['tempo_amamentacao'] = result['tempo_amamentacao'] ? result['tempo_amamentacao'].split('|') : null


        const bebesResult = await knex('bebe').select('*').where('mae_id',mae_id)
        const ordenhas = await knex('ordenha').select('*').where('mae_id',mae_id)

        if(bebesResult.length>0){
            for (let index = 0; index < bebes.length; index++){
                bebesResult[index].primeiro_estimulo = bebesResult[index].primeiro_estimulo?.split('|')
                bebesResult[index].mamadas = await knex('mamada').select('id','data_hora','mama','duracao').where('bebe_id','=',`${bebesResult[index].id}`)
            }
        }

           
        result.bebes=bebesResult
        result.ordenhas=ordenhas
        return res.json(result);
    }



}

export default UserController;