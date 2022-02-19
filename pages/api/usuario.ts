import type { NextApiRequest, NextApiResponse } from 'next';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';

const ususarioEndPoint = (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json('Usuário autenticado com sucesso!');
}

export default validarTokenJWT(ususarioEndPoint);