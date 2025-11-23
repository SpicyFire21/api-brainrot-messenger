import messageService from '../services/message.service.js';


export const getMessages = async (req,res) => {
    try {
        let data = await messageService.getMessages();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des messages");
    }
}

export const getMessageById = async (req,res) => {
    try {
        let data = await messageService.getMessageById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération du message par ID");
    }
}

export const deleteMessageById = async (req,res) => {
    try {
        let data = await messageService.deleteMessageById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch(error){
        console.error(error);
        return res.status(500).send("Erreur lors de la suppresion du message par ID");

    }
}

export const updateMessageById = async (req,res) => {
    try {
        let data = await messageService.updateMessageById(req.params.id,req.body.content);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch(error){
        console.error(error);
        return res.status(500).send("Erreur lors de la modification du message par ID");

    }
}

export const addMessage = async (req,res) => {
    try {
        let data = await messageService.addMessage(req.body);
        if(data){
            return res.status(data.status).json({ data: data });
        }else{
            return res.status(404).send("Échec de l'envoie du message");
        }
    }catch (error){
        console.error(error);
        return res.status(500).send("Erreur lors de l'envoie' du message");
    }
}

export const getConversation = async (req,res,next) => {
    try {
        let data = await messageService.getConversation(req.params.receiverid,req.params.senderid);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        // return res.status(200).json({ data: data });
        // console.log(data)
        res.locals.data = data;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération de la conversation");
    }
}