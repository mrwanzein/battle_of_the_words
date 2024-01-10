export let formattedEnglishDictionary = undefined;
export let formattedFrenchDictionary = undefined;
export let formattedSpanishDictionary = undefined;

(async function() {
    try {
        const english_words_txt_file = await fetch("/en_word_list.txt");
        const converted_english_words_txt_file = await english_words_txt_file.text();
        const english_words_array = converted_english_words_txt_file.split("\n");
        formattedEnglishDictionary = english_words_array.reduce((prev, curr) => {prev[curr] = 1; return prev}, {});
    } catch (error) {
        formattedEnglishDictionary = error.message;
    }
}());

(async function() {
    try {
        const french_words_txt_file = await fetch("/fr_word_list.txt");
        const converted_french_words_txt_file = await french_words_txt_file.text();
        const french_words_array = converted_french_words_txt_file.split("\n");
        formattedFrenchDictionary = french_words_array.reduce((prev, curr) => {prev[curr] = 1; return prev}, {});
    } catch (error) {
        formattedFrenchDictionary = error.message;
    }
}());

(async function() {
    try {
        const spanish_words_txt_file = await fetch("/es_word_list.txt");
        const converted_spanish_words_txt_file = await spanish_words_txt_file.text();
        const spanish_words_array = converted_spanish_words_txt_file.split("\n");
        formattedSpanishDictionary = spanish_words_array.reduce((prev, curr) => {prev[curr] = 1; return prev}, {});
    } catch (error) {
        formattedSpanishDictionary = error.message;
    }
}());
