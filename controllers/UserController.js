const { User } = require('../models/User')

async function addUser(args){
    console.log("entro");
    const existingUser = await User.findOne({name: args.name}).exec()
    if (existingUser){
        return {
            error: {
                code: "USER_ALREADY_EXISTS",
                message: "A user with this name already exists.",
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
    console.log("creo");
    console.log(user);
    
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
