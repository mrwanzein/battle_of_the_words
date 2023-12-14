import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBattleCounter } from "../../redux/features/game/gameSlice";
import styled from "styled-components";

const BattleCounter = () => {
    const [counter, setCounter] = useState(3);
    const dispatch = useDispatch();

    // remove for production?
    const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        if (skippedFirstRenderOfDoubleRender.current) {
            const countDownAudio = new Audio("/src/assets/sounds/3_2_1_go.wav");
            countDownAudio.play();

            const counterIntervalId = setInterval(() => {
                setCounter(prev => {
                    --prev;

                    dispatch(setBattleCounter(prev));
                    
                    if (prev <= -1) {
                        clearInterval(counterIntervalId);
                    }

                    return prev;
                });
            }, 1000);
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);
    
    return (
        <>
            {
                counter <= -1 ? null : <Counter>{counter <= 0 ? "GO!" : counter}</Counter>
            }
        </>
    )
}

export default BattleCounter;

const Counter = styled.span`
    font-size: 4em;
    color: lightgreen;
`