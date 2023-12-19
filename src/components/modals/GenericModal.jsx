import { RxCross2 } from "react-icons/rx";
import styled from "styled-components";
import Modal from "react-modal";

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "2px solid black",
        display: "flex",
        flexDirection: "column"
    }
}

const GenericModal = ({ modalIsOpen, onCloseModalFn, children }) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={onCloseModalFn}
            style={modalStyles}
        >
            <div>
                <XButton onClick={onCloseModalFn}><RxCross2 size={"1.5em"} /></XButton>
            </div>

            {children}
        </Modal>
    )
}

export default GenericModal;

const XButton = styled.button`
    margin-bottom: 10px;
    background: none;
    border: none;
    float: right;
    cursor: pointer;
    padding: 0;
`