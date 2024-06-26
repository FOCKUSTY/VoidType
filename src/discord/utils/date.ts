import { format } from 'date-fns';

let dateForm: any;

const dateCheck = (date: string | number | Date, form='dd.MM.yyyy HH:mm:ss') =>
{
    if(!date)
        return null;

    dateForm = new Date(date);
    dateForm = format(dateForm, `${form}`);
    return dateForm;
};

export
{
    dateCheck
}