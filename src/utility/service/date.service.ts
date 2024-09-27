import { format } from 'date-fns';

import type { Time as TimeType } from 'types/service/date.types';
import { monthDays } from 'types/service/date.enums';
import { Debug } from 'develop/debug.develop';

class Time {
    protected readonly _date: Date;
    protected readonly _time: TimeType;

    constructor(date?: Date, time?: TimeType) {
        this._date = date || new Date();
        this._time = time || {
            day: this._date.getDate(),
            month: this._date.getMonth()+1,
            year: this._date.getFullYear(),
            
            hour: this._date.getHours(),
            minutes: this._date.getMinutes(),
            seconds: this._date.getSeconds()
        };
    };

    public readonly getMonthDays = (month?: number): number => {
        const isArray = Array.isArray(this._time);

        if(month && month > 12)
            return 0;

        if(!month && (!isArray && this._time.month > 12))
            return 0;

        const days = month
            ? monthDays[month]
            : monthDays[isArray
                ? this._time[1]
                : this._time.month
            ];
    
        return days;
    };

    public readonly getMonthDaysFromJanuary = (month?: number): number => {
        const isArray = Array.isArray(this._time);

        if(month && month > 12)
            return 0;

        if(!month && (!isArray && this._time.month > 12))
            return 0;

        const M = month
            ? month
            : isArray
                ? this._time[1]
                : this._time.month;

        let output: number = 0;

        for(let i = 1; i < M; i++) {
            output += this.getMonthDays(i);
        };

        return output;
    };
};

class DateFormatter extends Time {
    constructor(date?: Date, time?: TimeType) {
        super(date, time);
    };
    
    public static Date = (date: string | number | Date, form='dd.MM.yyyy HH:mm:ss'): string => {
        if(!date)
            return 'Error';

        let dateForm: any = new Date(date);
        dateForm = format(dateForm, `${form}`);
        
        return dateForm;
    };

    public static Timestamp = (date: [ number, number, number ] | { day: number, month: number, year: number }) => {
        const toSeconds = 3600;

        const getDMY = (_date: [number, number, number]): [ number, number, number ] => {
            return [
                _date[0],
                new Time().getMonthDaysFromJanuary(_date[1]),
                _date[2] - 1970
            ];
        };

        const getOutput = (DMY: [number, number, number]) => {
            const [D, M, Y] = DMY;

            return Y*365 * 24 * toSeconds
                + Y * 6 * toSeconds
                + M * 24 * toSeconds
                + D * 24 * toSeconds;
        };

        const DMY = Array.isArray(date)
            ? getDMY(date)
            : getDMY([date.day, date.month, date.year]);

        return getOutput(DMY);
    };

    get date(): Date {
        return this._date;
    };
};

export default DateFormatter;