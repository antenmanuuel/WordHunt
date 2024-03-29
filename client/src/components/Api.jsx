import axios from "axios";
axios.defaults.withCredentials = true;

export const gamesAPI = {
  getAllGames: async () => {
    try {
      const response = await axios.get("https://wordhunt-fff9a57fb464.herokuapp.com/games");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },
  getGameById: async (id) => {
    try {
      const response = await axios.get(`https://wordhunt-fff9a57fb464.herokuapp.com/games/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching game by ID:", error);
    }
  },
  createGame: async (gameData) => {
    try {
      const response = await axios.post("https://wordhunt-fff9a57fb464.herokuapp.com/games", gameData);
      return response.data;
    } catch (error) {
      console.error("Error creating game:", error);
    }
  },
};

  
export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await axios.get("https://wordhunt-fff9a57fb464.herokuapp.com/users", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
  getUserById: async (id) => {
    try {
      const response = await axios.get(`https://wordhunt-fff9a57fb464.herokuapp.com/users/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  },
  createUser: async (userData) => {
    try {
      const response = await axios.post("https://wordhunt-fff9a57fb464.herokuapp.com/users", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
  loginUser: async () => {
    try {
      const response = await axios.get("https://wordhunt-fff9a57fb464.herokuapp.com/users/login", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
    }
  },
};
  

