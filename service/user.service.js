import { client } from "../index.js";

export async function deleteToken(username) {
    return await client
        .db('chat-box')
        .collection('token')
        .deleteOne({ email: username });
}

export async function getTokens(email) {
    return await client
        .db("chat-box")
        .collection("token")
        .findOne({ email: email });
}

export async function tokens(userFromDB, token) {
    return await client
        .db("chat-box")
        .collection("token")
        .insertOne({
            email: userFromDB.email,
            my_token: token
        });
}
export async function getUser(email) {
    return await client
        .db("chat-box")
        .collection("sign-up sign-in")
        .findOne({ email: email });
}
export async function createUsers(userDetails) {
    return await client
        .db("chat-box")
        .collection("sign-up sign-in")
        .insertOne(userDetails);
}
