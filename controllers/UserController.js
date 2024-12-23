const { User } = require('../models/User')

async function addUser(args){
    const existingUser = await User.findOne({name: args.name}).exec()
    if (existingUser){
        return {
            error: {
                code: "USER_ALREADY_EXISTS",
                message: "Usuario ya existe.",
                details: {
                    name: args.name
                }
            }
        };
    }

    const user = new User({
        name: args.name,
        password: args.password, 
        token: args.token,
    })
    
    await user.save()

    return user;
}

async function login(args){
    const user = await User.findOne({name: args.name}).exec()

    if (user.password != args.password)
        return {
            error: {
                code: "ERROR AUTH",
                message: "mala auth amic",
                details: {
                    name: args.name
                }
            }
        };

    return user;
}


async function existUser(args){
    const user = await User.findOne({token: args.token}).exec()

    if (user)
        return true;
    return false;
}


module.exports = {
    addUser,
    login,
    existUser
}
