import styled, { css } from "styled-components"

const PlayerHpBar = ({ playerHpInPercent, onTheRight }) => {
    return (
        <ParentWrapper $onTheRight={onTheRight}>
            <HpBar
                $playerHpInPercent={playerHpInPercent}
            />
        </ParentWrapper>
    )
}

export default PlayerHpBar;

const ParentWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    margin-top: 17%;
    border: 2.5px solid black;
    width: 15px;
    ${({$onTheRight}) => $onTheRight ? css`margin-left: 30px;` : css`margin-right: 30px;`}
`

const HpBar = styled.div`
    height: ${({$playerHpInPercent}) => $playerHpInPercent <= 0 ? 0 : $playerHpInPercent}%;
    width: 15px;
    background-color: ${({ $playerHpInPercent }) => {
        $playerHpInPercent = $playerHpInPercent <= 0 ? 0 : $playerHpInPercent;
        let color;
        
        if ($playerHpInPercent >= 60) color = "lightgreen";
        else if ($playerHpInPercent >= 30) color = "#fffc5d";
        else color = "#ff4646";

        return color;
    }};
    transition: height 1.2s ease-in-out, background-color 1.5s ease-in-out;
`