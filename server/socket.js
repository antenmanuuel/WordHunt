const socketIo = require('socket.io');
const models = require('./models')
const Game = models["Game"];
const User = models["User"];


function handleSocketConnection(server) {
    const io = socketIo(server, {
        cors: {origin: "https://wordhunt-fff9a57fb464.herokuapp.com/"}
    });

    const rooms = [{
        "player1": null,
        "player2": null,
        "player1Word": null,
        "player2Word": null,
        "numUsers": 0,
        "moves": [],
        "winner": null,
        "messages": [],
        "starttime": Date.now(),
    }];
    let lastRoom = 0 // keeps track of last room populated so no users are left waiting indefinitely

    io.on('connection', socket => {

        console.log("user connected");

        // find and join room
        let idx = rooms[lastRoom]["numUsers"] === 1 ? lastRoom : findRoom();
        let username = "";

        // join room and update last index and room
        lastRoom = idx;
        rooms[idx]["numUsers"]++;

        let currRoom = `room ${idx}`
        socket.join(currRoom);

        console.log(currRoom);

        // User sends username
        socket.on("USERNAME", user => {
            console.log(`Recieving username ${user}`);
            username = user;
            if (rooms[idx]["player1"] === null)
                rooms[idx]["player1"] = username;
            else
                rooms[idx]["player2"] = username;

            console.log(rooms[lastRoom])

            // send to client that they should wait for another player
            socket.emit("FINDING PLAYER");

            // check if two players found
            if (rooms[idx]["numUsers"] === 2)
                // broadcast to room that players have been found
                io.to(currRoom).emit("PLAYER FOUND");
        });


        /**
         * PUT THE REST OF THE SOCKET LOGIC BELOW HERE
         */
        
        socket.on("WORD CHOICE", data => {
            const { username, word } = data;
            console.log(username + " chose the word: " + word);

            console.log(`Recieving word ${word}`);

            // store word
            console.log("User server",username,word);
            console.log(rooms[idx]["player1"],rooms[idx]["player2"])
            console.log(currRoom);
            if (rooms[idx]["player1"] === username)
                rooms[idx]["player1Word"] = word;

            else
                rooms[idx]["player2Word"] = word;

            if (rooms[idx]["player1Word"] && rooms[idx]["player2Word"]) {
                rooms[idx]["starttime"] = Date.now();
                io.to(currRoom).emit("GAME START", {
                    playerOne: rooms[idx]["player1"], 
                    playerTwo: rooms[idx]["player2"]
                });
               
                
            }
            else
                socket.emit("WAITING FOR OTHER WORD CHOICE");
        });

        socket.on("WORD GUESS", word => {

            console.log(`Recieving Word Guess ${word}`)
            let wordToCompare;
            let nextUser;

            // find which user to compare against
            if (rooms[idx]["player1"] === username) {
                wordToCompare = rooms[idx]["player2Word"]
                nextUser = rooms[idx]["player2"];
            }
            else {
                wordToCompare = rooms[idx]["player1Word"];
                nextUser = rooms[idx]["player1"]
            }
            
            let lettersInCommon = findLetters(word, wordToCompare);
            rooms[idx]["moves"].push(`${word} - ${lettersInCommon}`)
            // compare letters and send info to clients
            if (wordToCompare.toLowerCase() === word.toLowerCase()) {
                    rooms[idx]["winner"] = username;
                    postGame(idx);
                    io.to(currRoom).emit("GAME OVER", username)
            }
            else {
                console.log("emitting switch turn");
                io.to(currRoom).emit("SWITCH TURN", nextUser, word, lettersInCommon);
            }
        })

        
        socket.on("MESSAGE", (message, username) => {
            console.log(`Receiving message from ${username}: ${message}`);
            rooms[idx]["messages"].push({ sender: username, text: message });
            socket.broadcast.to(currRoom).emit("MESSAGE", message, username);
        });
        
        


        // ----------------------------------------------

        socket.on("disconnect", () => {

            console.log(`user ${username} just disconnected`);
            if (currRoom)
                console.log(`Clearing ${currRoom}`);
            // send game over to client and set people in room to 0
            io.to(currRoom).emit("PLAYER LEFT");

            // clean up room
            rooms[idx] = {
                "player1": null,
                "player2": null,
                "player1Word": null,
                "player2Word": null,
                "numUsers": 0,
                "moves": [],
                "winner": null,
                "messages": [],
                "starttime": Date.now(),
                "endtime": Date.now()
            };
        });
    });

    // logic for finding first available room
    const findRoom = () => {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i]["numUsers"] < 2)
                return i;
        }
    
        // appends new room
        rooms.push({
            "player1": null,
            "player2": null,
            "player1Word": null,
            "player2Word": null,
            "numUsers": 0,
            "moves": [],
            "winner": null,
            "messages": [],
            "starttime": Date.now(),
            "endtime": Date.now()
        });
        return rooms.length - 1;
    }

    // IMPORTANT: word1 is the guess, word2 is the users actual word
    const findLetters = (word1, word2) => {
        // Convert the words to lowercase to make the comparison case-insensitive
        const lowerWord1 = word1.toLowerCase();
        const lowerWord2 = word2.toLowerCase();

        // Use a Set to store unique letters in each word
        const set1 = new Set(lowerWord1);
        const set2 = new Set(lowerWord2);

        // Find the intersection of the sets to get common letters
        const commonLetters = [...set1].filter(letter => set2.has(letter));

        // Return the count of common letters
        return commonLetters.length;
    }

    const postGame = async idx => {
        let room = rooms[idx];

        // create new Game object of completed game
        const newGame = new Game({
            player1: room["player1"],
            player2: room["player2"],
            moves: room["moves"],
            winner: room["winner"],
            starttime: room["starttime"],
            endttime: Date.now(),
            messages: room["messages"],
            p1word: room["player1Word"].toUpperCase(),
            p2word: room["player2Word"].toUpperCase()
        });

        try {

            // save the game to the database
            await newGame.save();

            // push the games to each players games list in the database
            await User.findOneAndUpdate(
                { "username": room["player1"] },
                { $push: { games: newGame} }
            );
            await User.findOneAndUpdate(
                { "username": room["player2"] },
                { $push: { games: newGame} }
            );
        } catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = handleSocketConnection;