import redis from "redis";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
const blocklist = redis.createClient({prefix: 'blocklist-acess-token:', url: "redis://default:redispw@localhost:49153"});
await blocklist.connect();


function generateHashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

async function addTokenInRedis(key, value, expirationDate) {
    await blocklist.set(key, value);
    blocklist.expireAt(key, expirationDate);
}

async function checkTokenInRedis(key) {
    const result = await blocklist.exists(key);
    return result === 1;
}


async function add(token) {
    const expirationDate = jwt.decode(token).exp;
    const hashToken = generateHashToken(token);
    await addTokenInRedis(hashToken, '', expirationDate);
}

async function checkToken(token) {
    const hashToken = generateHashToken(token);
    return checkTokenInRedis(hashToken);
}



export default {add, checkToken}