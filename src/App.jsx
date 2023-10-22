import styled from "styled-components"
import PlayArea from "./components/PlayArea"

function App() {
  return (
    <>
      <PlayAreaWrapper>
        <PlayArea />
      </PlayAreaWrapper>
    </>
  )
}

export default App

const PlayAreaWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`