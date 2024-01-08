import { FaGithub, FaLinkedin } from "react-icons/fa";
import styled from "styled-components";

const Footer = () => {
    return (
        <CustomFooter>
            <Copyright>© Copyright by Mrwan Zein </Copyright>
            <CustomATag href="https://github.com/mrwanzein" target="_blank" rel="noopener noreferrer"><FaGithub /></CustomATag>
            <CustomATag href="https://www.linkedin.com/in/mrwanzein" target="_blank" rel="noopener noreferrer"><FaLinkedin /></CustomATag>
        </CustomFooter>
    )
}

export default Footer;

const CustomFooter = styled.footer`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    background: #52709a;
    color: white;
`

const Copyright = styled.span`
    font-size: 0.7em;
    font-family: Arial;
    margin: 0 6px;
`

const CustomATag = styled.a`
    position: relative;
    top: 1px;
    font-size: 0.9em;
    margin: 0 6px;
    color: white;
`