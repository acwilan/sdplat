export function camelCaseToSentence(camelCase: string): string {
    // Split camelCase string into words
    const words = camelCase.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

    // Capitalize the first word and convert the rest to lowercase
    const capitalizedWords = words.map((word, index) => {
        if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
    });

    // Join the words into a sentence
    return capitalizedWords.join(' ');
}
