import { useState } from "react";
import styled from "styled-components";
import UsedWordsTracker from "./usedWords/UsedWordsTracker";
import PlayerInput from "./PlayerInput";

const PlayerArea = ({ playerObj, playerRole }) => {
    const [arrows, setArrows] = useState([]);

    return (
        <>
            <Wrapper>
                <UsedWordsTracker playerObj={playerObj} />

                <p>HP: {playerObj.hitPoints}</p>
                
                {
                    Array(5).fill(null).map((_, index) => 
                        <PlayerInput
                            key={`${playerRole}_input_${index + 1}`}
                            arrows={arrows}
                            setArrows={setArrows}
                            playerRole={playerRole}
                            playerObj={playerObj}
                            inputInstanceNumber={index + 1}
                        />
                    )
                }

                {
                    arrows.map(arrowComponent => arrowComponent)
                }
            </Wrapper>
        </>
    )
}

export default PlayerArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 200px; 
`