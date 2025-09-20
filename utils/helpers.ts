// --- Jalali Calendar Utilities ---
export const toJalali = (gy: number, gm: number, gd: number): [number, number, number] => {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
};

export const toJalaliDisplay = (gregorianDate?: string): string | undefined => {
    if (!gregorianDate || gregorianDate.split('-').length < 3) return undefined;
    try {
        const [gy, gm, gd] = gregorianDate.split('-').map(Number);
        if(isNaN(gy) || isNaN(gm) || isNaN(gd)) return gregorianDate;
        const [jy, jm, jd] = toJalali(gy, gm, gd);
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch(error) {
        console.log(error);
        return gregorianDate; // Fallback to original on error
    }
};


export const toGregorian = (jy: number, jm: number, jd: number): [number, number, number] => {
    let gy = (jy <= 979) ? 621 : 1600;
    jy -= (jy <= 979) ? 0 : 979;
    let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let gd = days + 1;
    const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy, gm, gd];
};

export const isJalaliLeap = (jy: number): boolean => (((((jy - 474) % 2820) + 474) + 38) * 682) % 2816 < 682;

export const jalaliMonthLength = (jy: number, jm: number): number => {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    if (isJalaliLeap(jy)) return 30;
    return 29;
};
// --- End of Jalali Calendar Utilities ---


// --- Number Formatting Utilities ---
export const formatPrice = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(String(value).replace(/[^۰-۹0-9]/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('fa-IR').format(num);
};

export const parsePrice = (value: string): number => {
  // Replace Persian numerals with English ones for parsing
  const englishValue = value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  return Number(englishValue.replace(/[^0-9]/g, ''));
};
// --- End of Number Formatting Utilities ---

// --- Contract Specific Utilities ---
export const calculateEndDate = (startDate: string, durationDays: number): string => {
    if (!startDate || durationDays === undefined || isNaN(durationDays)) return '';
    try {
        const start = new Date(startDate);
        start.setDate(start.getDate() + durationDays);
        const [jy, jm, jd] = toJalali(start.getFullYear(), start.getMonth() + 1, start.getDate());
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch (error) {
        console.log(error);
        return '';
    }
};
// --- End of Contract Specific Utilities ---