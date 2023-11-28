import GenericModal from "./GenericModal";
import styled from "styled-components";
import { BiErrorAlt } from "react-icons/bi";
import { BiError } from "react-icons/bi";

const iconStyles = {
    fontSize: "3em",
    margin: "20px",
    color: "white"
}

const ErrorModal = ({ modalIsOpen, onCloseModalFn, errorType, errorMsg }) => {
    return (
        <GenericModal
            modalIsOpen={modalIsOpen}
            onCloseModalFn={onCloseModalFn}
        >
            <ErrorWrapper $errorType={errorType}>
                <ErrorIconWrapper>
                    {
                        {
                            error: <BiErrorAlt style={iconStyles} />,
                            warning: <BiError style={iconStyles} />
                        }[errorType]
                    }
                </ErrorIconWrapper>

                <ErrorMessageWrapper>
                    <ErrorMessageStyle $errorType={errorType}>{errorMsg}</ErrorMessageStyle>
                </ErrorMessageWrapper>
            </ErrorWrapper>
        </GenericModal>
    )
}

export default ErrorModal;

const ErrorWrapper = styled.div`
    display: flex;
    border-radius: 5px;
    background-color: ${({$errorType}) => ({error: "#ff4949", warning: "#ffd100"}[$errorType])};
    margin-bottom: 30px;
`

const ErrorIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
    margin: 15px 0;
`

const ErrorMessageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const ErrorMessageStyle = styled.span`
    margin: 15px;
    color: ${({$errorType}) => ({error: "white", warning: "#454545"}[$errorType])};
`