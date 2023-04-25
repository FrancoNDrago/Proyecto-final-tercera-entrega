import userModel from "./models/user.model.js";
import cartModel from "./models/cart.model.js";

class UserDbDAO{

    constructor(){}

    async addUser(userToAdd){
        let cart = await cartModel.create({});

        userToAdd.cart = cart["_id"];

        return userModel.create(userToAdd);
    }

    getUserByEmail(email){
        return userModel.findOne({email});
    }

    getUserById(id){
        return userModel.findById(id);
    }

}

export default UserDbDAO;