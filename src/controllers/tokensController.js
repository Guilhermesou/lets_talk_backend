import jwt from "jsonwebtoken";
import allowlist from "../../redis/allowlist.js";
import blocklist from "../../redis/blocklist.js";

async function createToken(params = {}, [timeNumber, timeUnit]) {

    const token = jwt.sign(
        { ...params },
        process.env.SECRET,
        { expiresIn: timeNumber + timeUnit}
    );

    return token;
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

function expiresTokenJWT(token, blocklist, expiration) {
    return blocklist.add(token, expiration);
}

async function createOpacToken(id, [timeNumber, timeUnit], allowlist) {
    const opacToken = crypto.randomBytes(24).toString('hex');
    const expirationDate = moment().add(timeNumber, timeUnit).unix();
    await allowlist.addTokenInRedis(opacToken, id, expirationDate);
    return opacToken;
}

async function checkOpacToken(token, name, allowlist) {
    if (!token) {
        throw new Error('Token não enviado!');
    }
    const id = await allowlist.getValue(token);
    if (!id) {
        throw new Error('Token inválido!');
    }
    return id;
}

async function expiresOpacToken(token, allowlist) {
    await allowlist.del(token);
}

export default {
    access: {
        name: "access token",
        list: blocklist,
        expiration: [15, 'm'],
        create(params) {
            return createToken(params, this.expiration);
        },
        check(token) {
            return checkTokenJWT(token, this.name, this.list);
        },
        expires(token) {
            return expiresTokenJWT(token, this.list, this.expiration);
        }
    },
    refresh: {
        name: "refresh token",
        list: allowlist,
        expiration: [5, 'd'],
        create(id) {
            return createOpacToken(id, this.expiração, this.list);
        },
        check(token) {
            return checkOpacToken(token, this.name, this.list);
        },
        expires(token) {
            return expiresOpacToken(token, this.list);
        }
    }
}