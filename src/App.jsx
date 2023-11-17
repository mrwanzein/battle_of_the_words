import styled from "styled-components";
import Arena from "./components/Arena";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./home/HomePage";
import Home from "./home/Home";
import Tutorial from "./home/Tutorial";
import Rooms from "./home/Rooms";
import io from "socket.io-client";

// const socket = io("http://localhost:3000");

function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/rooms" element={<Rooms />} />
          </Route>

          <Route path="/arena" element={<Arena />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  )
}

export default App

const AppWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`