import GenericModal from "./GenericModal";
import styled from "styled-components";
import { BiErrorAlt } from "react-icons/bi";
import { BiError } from "react-icons/bi";

const iconStyles = {
    fontSize: "3em",
    margin: "20px",
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
                            error: <BiErrorAlt style={{...iconStyles, color: "white"}} />,
                            warning: <BiError style={{...iconStyles, color: "#8a8115"}} />
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
    background-color: ${({$errorType}) => ({error: "#ff4949", warning: "#fff600"}[$errorType])};
    margin-bottom: 30px;
`

const ErrorIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
`

const ErrorMessageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const ErrorMessageStyle = styled.span`
    margin: 15px 0px;
    margin-right: 15px;
    color: ${({$errorType}) => ({error: "white", warning: "#555207"}[$errorType])};
`