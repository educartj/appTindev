const axios = require('axios');
const Dev = require('../models/Dev');


module.exports = {
    async index(req, res) {
        const { user } = req.headers; //buscar usuario logado

        const loggedDev = await Dev.findById(user); //pegar a instancia, exemp.: os users (likes e Dislikes)

        //3 filtros (não está logado, não deu likes e dislikes)
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, // não pode vir o mesmo usuario logado
                { _id: { $nin: loggedDev.likes } }, // pegar todos likes e excluir
                { _id: { $nin: loggedDev.dislikes } }, // pegar todos dislikes e excluir
            ],
        })
        return res.json(users);
    },

    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username }); //buscar usuario se existir retornar ele

        if (userExists) {
            return res.json(userExists); //Pesquisar se tem usuario cadastrado e retornar ele
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = response.data; //desmembrar o data

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        })

        return res.json(dev);
    }
};

//Metodos INDEX, SHOW, STORE, UPDATE, DELETE