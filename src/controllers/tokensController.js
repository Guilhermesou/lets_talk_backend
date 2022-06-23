import blocklist from "../../redis/blocklist.js";
import jwt from "jsonwebtoken";

function generateToken(params = {}) {
    return jwt.sign(
        { params },
        process.env.SECRET,
        { expiresIn: process.env.JWTTOKENEXPIRESIN }
    );
}

async function checkTokenJWTInBlocklist(token, name, blocklist) {
    if (!blocklist) {
        return;
    }
    const tokenInBlocklist = await blocklist.checkToken(token);
    if (tokenInBlocklist) {
        throw new jwt.JsonWebTokenError(`${name} invalid by logout`);
    }
}

async function checkTokenJWT(token, name, blocklist) {
    await checkTokenJWTInBlocklist(token, name, blocklist);
    const { id } = jwt.verify(token, process.env.SECRET);
    return id;
}

function expiresTokenJWT(token, blocklist) {
    return blocklist.add(token);
}

export default {generateToken, checkTokenJWT, expiresTokenJWT}