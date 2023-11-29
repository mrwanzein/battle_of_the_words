export const calculatePercentageLengthOfDefendingWord = (currentInputLength, wordToDefendLength) => {
    const percentage = Math.round((currentInputLength / wordToDefendLength) * 100);
    return percentage >= 100 ? 100 : percentage;
}