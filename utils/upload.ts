export function formatDate(isoString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(isoString).toLocaleDateString(undefined, options);
}

export function formatDateShort(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();

    const japaneseMonth = `${formattedMonth}月`;
    const japaneseDay = `${formattedDay}日`;

    return `${year}年${japaneseMonth}${japaneseDay}`;
}