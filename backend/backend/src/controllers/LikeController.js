const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        console.log(req.io, req.connecteUsers);
        
        const { user } = req.headers;
        const { devId } = req.params;

        //pegar tudo, a intancia
        const loggedDev = await Dev.findById(user); //encontrar pelo id logado que está fazendo a ação
        const targetDev = await Dev.findById(devId); //buscar quem recebeu  

        if (!targetDev) { //se o usuario não existe
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) { //se já existe o like
            const loggedSocket = req.connecteUsers[user];
            const targetSocket = req.connecteUsers[devId];
            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggedDev)
            }
        }

        loggedDev.likes.push(targetDev._id); //add o  id

        await loggedDev.save(); //salvando 

        return res.json(loggedDev);

    }
};