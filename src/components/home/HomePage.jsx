import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { MakeWholeDivAsLink } from "../shared_styles/sharedStyles";

const HomePage = () => {
    return (
        <HomePageWrapper>
            <HomePageArea>
                <LinksWrapper>
                    <IndividualLinkWrapper>
                        <NavLink
                            to="/"
                            style={({isActive}) => ({
                                borderBottom: isActive ? "2px solid black" : "unset",
                                fontFamily: "wheaton"
                            })}
                        >
                            HOME
                            <MakeWholeDivAsLink></MakeWholeDivAsLink>
                        </NavLink>
                    </IndividualLinkWrapper>
                    
                    <IndividualLinkWrapper
                        style={{
                            borderRight: "2px solid black",
                            borderLeft: "2px solid black"
                        }}
                    >
                        <NavLink
                            to="tutorial"
                            style={({isActive}) => ({
                                borderBottom: isActive ? "2px solid black" : "unset",
                                fontFamily: "wheaton"
                            })}
                        >
                            TUTORIAL
                            <MakeWholeDivAsLink></MakeWholeDivAsLink>
                        </NavLink>
                    </IndividualLinkWrapper>
                    
                    <IndividualLinkWrapper>
                        <NavLink
                            to="rooms"
                            style={({isActive}) => ({
                                borderBottom: isActive ? "2px solid black" : "unset",
                                fontFamily: "wheaton"
                            })}
                        >
                            ROOMS
                            <MakeWholeDivAsLink></MakeWholeDivAsLink>
                        </NavLink>
                    </IndividualLinkWrapper>
                </LinksWrapper>

                <Outlet />
            </HomePageArea>
        </HomePageWrapper>
    )
}

export default HomePage;

const HomePageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 80px);

    @media only screen and (max-height: 768px) {
        height: 100%;
    } 
`

const HomePageArea = styled.div`
    display: flex;
    flex-direction: column;
    height: 75%;
    width: 65%;
    border: 2px solid black;
    border-radius: 10px;

    @media only screen and (max-height: 768px) {
        height: 85%;
        width: 70%;
    } 
`

const LinksWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    height: 70px;
    border-bottom: 2px solid black;

    a {
        text-decoration: none;
        color: black;

        &:active {
            color: initial;
        }
    }
`

const IndividualLinkWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: auto;
`