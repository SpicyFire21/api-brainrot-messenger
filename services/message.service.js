import pool from '../database/db.js';
import { v4 as uuidv4 } from "uuid";


async function getMessages(){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM messages');
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des messages' };
    } finally {
        db.release();
    }
}

async function getMessageById(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM messages WHERE messages.id = $1', [id]);
        if (res.rows.length === 0 && !id) {
            return { error: 1, status: 404, data: `Message not found or doesn't exist | ${id}` };
        }
        return { error: 0, data: res.rows[0] };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Error retrieving message by ID' };
    } finally {
        db.release();
    }
}


async function deleteMessageById(id){
    const db = await pool.connect();
    try {
        await db.query('DELETE FROM messages WHERE messages.id = $1 ', [id]);

        return { error: 0, data: `Message deleted with success ${id}` };
    }catch (error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error deleting message by ID' };
    } finally {
        db.release();
    }
}

async function updateMessageById(id,msg){
    const db = await pool.connect();

    if(!msg){
        return { error: 1, status: 400, data: 'u cant edit an empty message' };
    }

    try {
        const result = await db.query('UPDATE messages SET content=$1 WHERE messages.id = $2 RETURNING *', [msg,id]);

        if (result.rowCount === 0) {
            return { error: 1, status: 404, data: "Message not found" };
        }
        return { error: 0, status: 200, data: result.rows[0] };
    }catch (error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error updating message by ID' };
    } finally {
        db.release();
    }
}

async function addMessage(newMessage){
    console.log(newMessage)
    const db = await pool.connect();
    let newid = uuidv4();
    const currentDate = new Date().toISOString();
    if(!newMessage.content){
        return { error: 1, status: 400, data: 'Please add a content to the message' };
    }

    if(!newMessage.senderid){
        return { error: 1, status: 400, data: 'Please add the id of the sender' };
    }
    if(!newMessage.receiverid){
        return { error: 1, status: 400, data: 'Please add the id of the receiver' };
    }
    try {
        const result = await db.query('INSERT INTO messages (id,content,createdat,senderid,receiverid) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [newid,newMessage.content,currentDate,newMessage.senderid,newMessage.receiverid,]);

        return { error: 0, status: 201, data: result.rows[0] };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Error sending the message' };
    } finally {
        db.release();
    }
}

async function getConversation(receiverid,senderid){
    const db = await pool.connect();

    if(!senderid){
        return { error: 1, status: 400, data: 'Please add the id of the sender' };
    }
    if(!receiverid){
        return { error: 1, status: 400, data: 'Please add the id of the receiver' };
    }

    try {

        const res = await db.query('SELECT * FROM messages m where (m.senderid=$1 AND m.receiverid=$2) OR (m.senderid=$2 AND m.receiverid=$1)',[receiverid,senderid])
        if (res.rows.length === 0 && !receiverid && !senderid) {
            return { error: 1, status: 404, data: `Message not found or doesn't exist : \nreceiverid →${receiverid} \nsenderid →${senderid}` };
        }
        return { error: 0, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Error sending the message' };
    } finally {
        db.release();
    }


}


export default {
    getMessages,
    getMessageById,
    deleteMessageById,
    updateMessageById,
    addMessage,
    getConversation
}