import userService from "../services/user.service.js";

export const getUsers = async (req,res) => {
    try {
        let data = await userService.getUsers();

        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
}

export const getUserById = async (req,res) => {
    try {
        let data = await userService.getUserById(req.params.id);

        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur par ID");
    }
}

export const loginUser = async (req,res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: 1, status: 404, data: `aucun login et/ou mot de passe fourni ${login}|${password}` });
        }
        let data = await userService.loginUser({login, password});
        if (data) {
            return res.status(data.status).json({ data: data });
        } else {
            return res.status(404).send("Login et/ou mot de passe incorrect");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la connexion de l'utilisateur");
    }
}

export const deleteUserById = async (req,res) => {
    try {
        let data = await userService.deleteUserById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    }catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la suppression de l'utilisateur par id");
    }
}

export const addUser = async (req,res) => {
    try{
        console.log(req.body)
        let data = await userService.addUser(req.body);
        return res.status(data.status).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la création de l'utilisateur");
    }
}

