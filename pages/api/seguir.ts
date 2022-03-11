import { politicaCORS } from './../../middlewares/politicaCORS';
import { UsuarioModel } from './../../models/UsuarioModel';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import { validarTokenJWT } from './../../middlewares/validarTokenJWT';
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { SeguidorModel } from '../../models/SeguidorModel';

const endPointSeguir = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try {
        if (req.method === 'PUT') {

            const { userId, id } = req?.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if (!userId) {
                return res.status(400).json({ erro: 'Usuário logado não encontado!' });
            }
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if (!id) {
                return res.status(400).json({ erro: 'Usuário a ser seguido não encontado!' });
            }
            const euJaSigoEsseUsuario = await SeguidorModel.find({ usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id });

            if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
                euJaSigoEsseUsuario.forEach(async (e: any) => await SeguidorModel.findByIdAndDelete({
                    _id: e._id
                }));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);

                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido);

                return res.status(200).json({ msg: 'Deixou de seguir o usuário com sucesso!' });
            } else {
                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);

                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);

                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido);

                return res.status(200).json({ msg: 'Usuário seguido com sucesso!' });

            }
        }

        return res.status(405).json({ erro: 'Método Informádo não existe!' });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Não foi possível seguir/deixar de seguir o usuário informado!' });
    }

}

export default  politicaCORS(validarTokenJWT(conectarMongoDB(endPointSeguir)));