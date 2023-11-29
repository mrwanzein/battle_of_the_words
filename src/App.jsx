import styled from "styled-components";
import Arena from "./components/Arena";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import Home from "./components/home/Home";
import Tutorial from "./components/tutorial/Tutorial";
import Rooms from "./components/room/Rooms";

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

          <Route path="/arena/:roomId" element={<Arena />} />
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