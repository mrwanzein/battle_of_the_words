import styled from "styled-components";
import Arena from "./components/Arena";

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