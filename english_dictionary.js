import english_dict from "./english_dictionary.json";

export const formattedEnglishDictionary = Object.keys(english_dict).reduce((prev, curr) => {prev[curr.toLowerCase()] = 1; return prev}, {});