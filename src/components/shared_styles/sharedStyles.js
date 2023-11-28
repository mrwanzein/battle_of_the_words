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

export const GenericButton = styled.button`
    box-shadow: inset 0px -3px 7px 0px #29bbff;
	background: linear-gradient(to bottom, #2dabf9 5%, #0688fa 100%);
	background-color: #2dabf9;
	border-radius: 3px;
	border: 1px solid #0b0e07;
    cursor: pointer;
	color: #ffffff;
	display: inline-block;
	font-family: Arial;
	font-size: 15px;
	padding: 9px 23px;
	text-decoration: none;
	text-shadow: 0px 1px 0px #263666;

    &:hover {
        background: linear-gradient(to bottom, #0688fa 5%, #2dabf9 100%);
	    background-color: #0688fa;
    }

    &:active {
        position: relative;
	    top: 1px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`

export const JoinRoomButtonGeneric = styled.button`
    background-color:#44c767;
	border-radius:28px;
	border:1px solid #18ab29;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	padding:16px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #2f6627;

    &:hover {
        opacity: .7;
    }

    &:active {
        position: relative;
	    top: 1px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`

export const GenericIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`