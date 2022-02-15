import { UsuarioModel } from './../../models/UsuarioModel';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';

const endPointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    if (req.method === 'POST') {

        const usuario = req.body as CadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: 'Nome inválido!' });
        }

        if (!usuario.email || usuario.email.length < 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')) {
            return res.status(400).json({ erro: 'E-mail inválido!' });
        }

        if (!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({ erro: 'Senha inválida!' });
        }

        //validação se ja existe usuario com o email informado
        const usuariosComMesmoEmail = await UsuarioModel.find({email: usuario.email});
        if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0 ){
            return res.status(400).json({erro: 'Já existe uma conta com o email informado'});
        }

        //Salvar Usuário no banco de dados
        const usuarioASerSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha)
        }
        await UsuarioModel.create(usuarioASerSalvo);
        res.status(200).json({ msg: 'Usuário criado com sucesso!!!' });
    }
    return res.status(405).json({ erro: 'Método informado não válido!' });
}

export default conectarMongoDB(endPointCadastro);