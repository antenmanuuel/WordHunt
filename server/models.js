const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    username:{type:String, required: true},
    games: {type: [mongoose.Schema.Types.ObjectId], ref:"Game", default: []}
})

const gameSchema= new mongoose.Schema({
    player1:{type:String, required:true},
    player2:{type:String, required:true},
    moves:{type:Array,default:[]},
    winner:{type:String},
    starttime: { type: Date, default: new Date() },
    endttime:{type: Date},
    messages:{type:Array, default:[]},
    p1word:{type:String},
    p2word:{type:String}
})

const User= mongoose.model("User", userSchema);
const Game= mongoose.model("Game",gameSchema);

module.exports = {
    User: User,
    Game: Game
};

