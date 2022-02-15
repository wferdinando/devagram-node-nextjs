import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from "md5";

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method == 'POST') {
        const { login, senha } = req.body;

        const usuarioEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuarioEncontrados && usuarioEncontrados.length > 0) {
            const usuarioEncontrado = usuarioEncontrados[0];
            return res.status(200).json({ msg: `Usuário ${usuarioEncontrado.nome} autenticado com sucesso!!`});
        }
        return res.status(400).json({ erro: 'Usuário ou Senha não encontrados' });
    }
    return res.status(405).json({ erro: 'Método informado não válido!' });
}

export default conectarMongoDB(endPointLogin);