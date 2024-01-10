import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementBattleCounter } from "../../redux/features/game/gameSlice";
import styled from "styled-components";
import countDownAudioSrc from "../../assets/sounds/3_2_1_go.wav";

const BattleCounter = () => {
    const battleCounter = useSelector(state => state.gameState.battleCounter);
    const dispatch = useDispatch();

    // remove for production
    // const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        let innerCounter = 3;
        
        // if (skippedFirstRenderOfDoubleRender.current) {
            const countDownAudio = new Audio(countDownAudioSrc);
            countDownAudio.play();

            const counterIntervalId = setInterval(() => {
                dispatch(decrementBattleCounter());
                innerCounter--; 
                
                if (innerCounter <= -1) {
                    clearInterval(counterIntervalId);
                }
            }, 1000);
        // }

        // return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);
    
    return (
        <>
            {
                battleCounter <= -1 ? null : <Counter>{battleCounter <= 0 ? "GO!" : battleCounter}</Counter>
            }
        </>
    )
}

export default BattleCounter;

const Counter = styled.span`
    font-size: 4em;
    color: lightgreen;
`