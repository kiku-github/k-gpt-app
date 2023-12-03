export const generateTextWithLineBreaks = (text: string) => {
    return text.replace(/\n/g, '<br>');
};