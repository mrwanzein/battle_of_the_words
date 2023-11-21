import styled from "styled-components";

const ModalTopRightXButton = ({ onCloseFn }) => {
    return (
        <div style={{float: "right"}}>
            <XButton onClick={onCloseFn}>X</XButton>
        </div>
    )
}

export default ModalTopRightXButton;

const XButton = styled.button`
    margin-bottom: 10px;
    background: none;
    border: none;
    float: right;
    cursor: pointer;
`