
// Helper to sanitize report object for API updates
export const sanitizeReport = (report: any) => {
    const sanitized: any = {};
    for (const key in report) {
        if (report[key] === null || report[key] === undefined) {
            sanitized[key] = '';
        } else {
            sanitized[key] = report[key];
        }
    }
    return sanitized;
};

export function cleanText(text: string | null | undefined): string {
    if (!text) return '';
    return String(text).replace(/_x000D_/g, '\n').replace(/\r/g, '');
}
