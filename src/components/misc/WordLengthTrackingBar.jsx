import styled from "styled-components";

const WordLengthTrackingBar = ({ trackingPercentage }) => {
    return (
        <ParentWrapper>
            <TrackingBar $trackingPercentage={trackingPercentage} />
        </ParentWrapper>
    )
}

export default WordLengthTrackingBar;

const ParentWrapper = styled.div`
    height: 5px;
    flex: 1;
    margin-right: 5px;
`

const TrackingBar = styled.div`
    height: inherit;
    width: ${({ $trackingPercentage }) => $trackingPercentage >= 100 ? 100 : $trackingPercentage}%;
    background-color: ${({ $trackingPercentage }) => {
        $trackingPercentage = $trackingPercentage >= 100 ? 100 : $trackingPercentage;
        let color = "#fc2803";
        
        if ($trackingPercentage >= 50) color = "#fca503";
        if ($trackingPercentage >= 80) color = "#90fc03";
        if ($trackingPercentage >= 100) color = "#03fc07";

        return color;
    }};
    transition: width .7s, background-color .7s;
    border-radius: 10px;
`