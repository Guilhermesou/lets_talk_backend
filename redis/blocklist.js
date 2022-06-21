import redis from "redis";
import { createHash } from "crypto";
const blocklist = redis.createClient({prefix: 'blocklist-acess=token:'});

const expiration = process.env.JWTTOKENEXPIRESIN;

function generateHashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

async function addTokenInRedis(key, value, expirationDate) {
    await blocklist.set(key, value);
    blocklist.expireAt(expirationDate);
}

async function checkTokenInRedis(key) {
    const result = await blocklist.exists(key);
    return result === 1;
}


async function add(token) {
    const hashToken = generateHashToken(token, expiration);
    await addTokenInRedis(hashToken, '');
}

async function checkToken(token) {
    const hashToken = generateHashToken(token);
    return checkTokenInRedis(hashToken);
}



export default {add, checkToken}