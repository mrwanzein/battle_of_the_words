import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
    const navigate = useNavigate();
    
    return (
        <NavDiv>
            <GameName onClick={() => navigate("/")}>Battle of the words</GameName>
        </NavDiv>
    )
}

export default Navbar;

const NavDiv = styled.div`
    height: 80px;
    background-color: #3a7bd6;
    display: flex;
    align-items: center;
`

const GameName = styled.span`
    font-size: 1.5em;
    cursor: pointer;
    margin-left: 50px;
    color: white;
`