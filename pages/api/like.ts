import { politicaCORS } from './../../middlewares/politicaCORS';
import { UsuarioModel } from './../../models/UsuarioModel';
import { PublicacaoModel } from './../../models/PublicacaoModel';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import { validarTokenJWT } from './../../middlewares/validarTokenJWT';
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";



const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try {

        if (req.method === 'PUT') {
            const { id } = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if (!publicacao) {
                return res.status(400).json({ erro: 'Publicao nao encontrada!' });
            }

            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuário nao encontrado!' });
            }

            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());

            if (indexDoUsuarioNoLike != -1) {
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await PublicacaoModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao);
                return res.status(200).json({ msg: 'Publicação descurtida com sucesso!' });
            } else {
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao);
                return res.status(200).json({ msg: 'Publicação curtida com sucesso!' });
            }

        }
        return res.status(405).json({ erro: 'Método informado não é válido!' });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Ocorreu um erro ao curtir/descurtir' });
    }

}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));
