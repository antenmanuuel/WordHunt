import { useState, useEffect } from "react";
import io from "socket.io-client";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import StatsPage from "./pages/StatsPage";
import FindingPlayerPage from "./components/FindPlayer";
import EnterWordPage from "./components/EnterWordPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RulesPage from "./pages/RulesPage";
import GameOverPage from "./pages/GameOverPage";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("https://wordhunt-fff9a57fb464.herokuapp.com/", {
      autoConnect: false,
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <main>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/game" element={<GamePage socket={socket} />} />
          <Route
            path="/find-player"
            element={<FindingPlayerPage socket={socket} />}
          />
          <Route path="/stats" element={<StatsPage socket={socket} />} />
          <Route path="/game-rules" element={<RulesPage />} />
          <Route
            path="/enter-word"
            element={<EnterWordPage socket={socket} />}
          />
          <Route path="/game-over" element={<GameOverPage socket={socket} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
