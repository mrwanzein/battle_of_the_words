import styled from "styled-components";

export const UsedWordBadge = styled.span`
    background-color: lightgrey;
    color: black;
    padding: 4px 8px;
    text-align: center;
    border-radius: 5px;
    margin: 5px;
`

export const MakeWholeDivAsLink = styled.span`
    position:absolute; 
    width:100%;
    height:100%;
    top:0;
    left: 0;

    &:hover {
        background-color: aliceblue;
        opacity: 0.40;
    }
`