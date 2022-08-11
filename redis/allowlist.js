import redis from "redis";

const allowlist = redis.createClient({prefix: 'allowlist-refresh-token:', url: "redis://default:redispw@localhost:49153"});
await allowlist.connect();
const expiration = process.env.JWTTOKENEXPIRESIN;

async function addTokenInRedis(key, value, expirationDate) {
    await allowlist.set(key, value);
    allowlist.expireAt(expirationDate);
}

async function getValue(key) {
    const value = await allowlist.get(key);
    return value;
}

async function checkTokenInRedis(key) {
    const result = await allowlist.exists(key);
    return result === 1;
}

async function del(key) {
    await allowlist.del(key);
}

export default {addTokenInRedis, checkTokenInRedis, del, getValue}