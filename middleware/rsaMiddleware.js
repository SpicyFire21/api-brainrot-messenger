import pool from '../database/db.js'

import {encrypt,decrypt} from "./RSA.js";

// Chiffrement avant envoi (avec la clé publique du destinataire)
export async function rsaEncryptMiddleware(req, res, next) {
    console.log("encrypt")
    try {
        const {  receiverid, content } = req.body;
        if (! receiverid || !content) return next();

        const result = await pool.query(
            'SELECT public_key, rsa_modulo FROM users WHERE id = $1',
            [ receiverid]
        );
        if (result.rows.length === 0) return next();

        const { public_key, rsa_modulo } = result.rows[0];
        const e = Number(public_key);
        const n = Number(rsa_modulo);

        const cipher = encrypt(content, e, n);
        console.log("e",e);
        console.log("n",n);
        console.log("cipher",cipher);
        req.body.content = JSON.stringify(cipher);
        next();
    } catch (err) {
        console.error('Erreur chiffrement RSA :', err);
        next();
    }
}

// Déchiffrement à la réception (avec la clé privée du destinataire connecté)
export async function rsaDecryptMiddleware(req, res, next) {
    try {
        const userId = req.headers["user-id"];
        const messages = res.locals.data.data;

        if (!Array.isArray(messages)) return next();

        for (const msg of messages) {
            const receiverId = msg.receiverid;

            if (userId !== receiverId && userId !== msg.senderid) {
                continue;
            }

            const result = await pool.query(
                "SELECT private_key, rsa_modulo FROM users WHERE id = $1",
                [receiverId]
            );

            if (result.rows.length === 0) continue;

            const { private_key, rsa_modulo } = result.rows[0];
            const d = Number(private_key);
            const n = Number(rsa_modulo);

            if (msg.content) {
                msg.content = decrypt(JSON.parse(msg.content), d, n);
            }
        }

        next();
    } catch (err) {
        console.error("Erreur déchiffrement RSA :", err);
        next(err);
    }
}



