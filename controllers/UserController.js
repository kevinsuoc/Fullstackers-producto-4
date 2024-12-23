const { User } = require('../models/User')

async function addUser(args){
    const existingUser = await User.find({token: args.token}).exec()

    if (existingUser)
        return null;

    const user = new User({
        name: args.nombre,
        password: args.description, 
        token: args.token,
    })
    
    await user.save()

    return user;
}

async function login(args){
    const user = await User.find({name: args.name}).exec()

    if (user.password != args.password)
        return null

    return user;
}

module.exports = {
    addUser,
    login
}
