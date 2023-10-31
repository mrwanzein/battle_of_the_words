import Xarrow from "react-xarrows"

const XarrowInstance = ({ elementStartId, elementEndId }) => {
    return (
        <Xarrow
            start={elementStartId}
            end={elementEndId}
        />
    )
}

export default XarrowInstance;