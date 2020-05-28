const {Schema, model} = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required:true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    //fazendo relacionamento no banco c/ []VETOR, referenciar varios Dev
    likes:[{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
    dislikes:[{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
}, {
    timestamps: true, //criar createAt, updateAt (colunas) para armazenar data de criação
});


module.exports = model('Dev', DevSchema)