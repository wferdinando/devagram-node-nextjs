import { UsuarioModel } from './../../models/UsuarioModel';
import { RespostaPadraoMsg } from './../../types/RespostaPadraoMsg';
import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

const ususarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        const { userId } = req?.query; //pega o id do usuário que está no token decodificado no login.
        //como buscar os dados do usuário no banco?
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({ erro: 'Não foi possível obter os dados do usuário!' });
}

export default validarTokenJWT(conectarMongoDB(ususarioEndPoint));