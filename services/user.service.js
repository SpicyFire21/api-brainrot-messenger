import pool from '../database/db.js';
import {v4 as uuidv4} from "uuid";
import bcrypt from 'bcrypt';
import {generateKeys} from '../middleware/RSA.js';


async function getUsers() {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM users');

        const users = res.rows

        return { error: 0, status: 200, data:users };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des utilisateurs' };
    } finally {
        db.release();
    }
}


async function getUserById(id) {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM users WHERE users.id = $1', [id]);
        if (res.rows.length === 0) {
            return {error: 1, status: 404, data: 'User not found or doesn\'t exist'};
        }

        const user = res.rows[0];

        if (user.avatar) {

            user.avatar = user.avatar.toString();
        }

        return {error: 0, data: user};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error retrieving user by ID'};
    } finally {
        db.release();
    }
}

async function loginUser(data) {
    const db = await pool.connect();
    try {
        if (!data.login || !data.password) {
            return {error: 1, status: 404, data: 'aucun login et/ou mot de passe fourni'};
        }

        const result = await db.query('SELECT * FROM users WHERE pseudo = $1', [data.login]);

        if (result.rows.length === 0) {
            return {error: 1, status: 404, data: 'login et/ou mot de passe incorrect'};
        }

        let user = result.rows[0];
        let passwordMatch;

        if (user.password.startsWith('$2b$')) {
            passwordMatch = bcrypt.compareSync(data.password, user.password);
        } else {
            passwordMatch = data.password === user.password;
            const safePassword = await bcrypt.hash(data.password, 10);

            console.warn(`le mot de passe de l'utilisateur ${data.login} est en clair dans la bdd !!`)
            console.warn(`id → ${user.id}`)
            console.warn(`→ ${safePassword}`)
        }

        if (!passwordMatch) {
            return { error: 1, status: 404, data: 'login et/ou mot de passe incorrect' };
        }
        return {error: 0, status: 200, data: user};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Erreur lors de la connexion de l\'utilisateur'};
    } finally {
        db.release();
    }
}

async function deleteUserById(id) {
    const db = await pool.connect();
    try {
        await db.query('DELETE FROM users WHERE users.id = $1 ', [id]);

        return {error: 0, data: `User deleted with success ${id}`};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error deleting user by ID'};
    } finally {
        db.release();
    }
}




async function addUser(newuser){
    const db = await pool.connect();
    let newid = uuidv4();

    if(!newuser.pseudo){
        return { error: 1, status: 400, data: 'Please add the pseudo' };
    }
    if(!newuser.password){
        return { error: 1, status: 400, data: 'Please add the password' };
    }
    const { e, d, n } = generateKeys();

    try {
        const pseudoExist = await db.query('SELECT * FROM users WHERE users.pseudo=$1',[newuser.pseudo]);
        if (pseudoExist.rows.length > 0) {
            return { error: 1, status: 400, data: 'Pseudo already used' };
        }


        const hashedpassword = await bcrypt.hash(newuser.password, 10);

        const result = await db.query('INSERT INTO users (id,pseudo,password,public_key, private_key,rsa_modulo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [newid,newuser.pseudo,hashedpassword,e.toString(),d.toString(),n.toString()])

        return { error: 0, status: 200, data: result.rows[0] };
    } catch (error){
        console.error(error);
        return { error: 1, status: 500, data: "Error creating the new user" };
    } finally {
        db.release();
    }
}













export default {
    getUsers,
    getUserById,
    loginUser,
    deleteUserById,
    addUser,

}