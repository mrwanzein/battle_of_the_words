import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { MakeWholeDivAsLink } from "../components/shared_styles/sharedStyles";

const HomePage = () => {
    return (
        <HomePageArea>
            <LinksWrapper>
                <IndividualLinkWrapper>
                    <NavLink
                        to="/"
                        style={({isActive}) => ({
                            borderBottom: isActive ? "2px solid black" : "unset"
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
                            borderBottom: isActive ? "2px solid black" : "unset"
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
                            borderBottom: isActive ? "2px solid black" : "unset"
                        })}
                    >
                        ROOMS
                        <MakeWholeDivAsLink></MakeWholeDivAsLink>
                    </NavLink>
                </IndividualLinkWrapper>
            </LinksWrapper>

            <Outlet />
        </HomePageArea>
    )
}

export default HomePage;

const HomePageArea = styled.div`
    height: 600px;
    width: 800px;
    border: 2px solid black;
    border-radius: 10px;
`

const LinksWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    height: 70px;
    border-bottom: 2px solid black;

    a {
        text-decoration: none;

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