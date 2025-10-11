// src/utils/dateUtils.js
export const formatDateTimeForInput = (date) => {
    if (!date) return { date: '', time: '' };

    const d = new Date(date);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toTimeString().slice(0, 5);

    return { date: dateStr, time: timeStr };
};

export const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`).toISOString();
};