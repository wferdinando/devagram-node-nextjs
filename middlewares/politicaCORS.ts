import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import NextCors from "nextjs-cors";

export const politicaCORS = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {

        try {

            await NextCors(req, res, {

                origin: '*',
                methods: ['POST', 'PUT', 'GET'],
                header: ['x-api-token'],
                optionsSuccessStatus: 200,

            });

        } catch (e) {
            console.log('Erro ao tratar a política de CORS:', e);
            return res.status(500).json({ erro: 'Ocorreu um erro ao tratar a política de CORS!' });
        }

        return handler(req, res);
    }