import jwt from "jsonwebtoken";
import tokens from "../controllers/tokensController.js";


export default async function header(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({error: 'No token provided'});
    }

    const parts = authHeader.split(' ');

    console.log(authHeader);
    if (!parts.length === 2) {
        return res.status(401).send({error: 'Token error'});
    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) { 
        return res.status(401).send({ error: 'Token malformatted' });
    }

    try {
        const decoded = await tokens.access.check(token, process.env.SECRET);
        req.userId = decoded.id;
        req.token = token;
        return  next();
    } catch (error) {
        return res.status(401).send({error: 'Token invalid'})
    }
        
}