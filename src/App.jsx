import styled from "styled-components";
import Arena from "./components/Arena";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  return (
    <>
      <ArenaWrapper>
        <Arena />
      </ArenaWrapper>
    </>
  )
}

export default App

const ArenaWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`