import styled from "styled-components";
import { ImSpinner2 } from "react-icons/im";

const LoadingSpinner = ({ customSize }) => {
    return (
        <Spinner><ImSpinner2 size={customSize} /></Spinner>
    )
}

export default LoadingSpinner;

const Spinner = styled.span`
    @keyframes loadingSpinner {
        to {transform: rotate(360deg)}
    }

    display: inline-flex;
    animation: loadingSpinner 0.65s linear infinite;
`