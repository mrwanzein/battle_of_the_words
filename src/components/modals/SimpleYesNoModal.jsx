import { GenericButton } from "../shared_styles/sharedStyles";
import GenericModal from "./GenericModal";
import styled from "styled-components";

const SimpleYesNoModal = ({ modalIsOpen, confirmationText, theYesFunction, theNoFunction }) => {
    return (
        <GenericModal
            modalIsOpen={modalIsOpen}
            onCloseModalFn={theNoFunction}
        >
            <ConfirmationText>{confirmationText}</ConfirmationText>
            <ModalWrapper>
                <YesNoButton onClick={theYesFunction}>Yes</YesNoButton>
                <YesNoButton onClick={theNoFunction}>No</YesNoButton>
            </ModalWrapper>
        </GenericModal>
    )
}

export default SimpleYesNoModal;

const YesNoButton = styled(GenericButton)`
    margin: 0 15px;
`

const ConfirmationText = styled.span`
    align-self: center;
    margin-bottom: 35px;
    font-size: 1.4em;
`

const ModalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`