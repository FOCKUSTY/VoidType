import { pseudoRandomNumber } from './pseudoRandom'

const getKey = (value: any, map: any) =>
{
    return [...map].find(([key, val]) => val == value);
};

const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const numbers: string = '1234567890';
const symbols: string = '!@#$%^&*()_+-={}[]:;"\'"|,.<>/?~`№';
let lettersHash = [];

const enabledPasswordLetters: any = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-={}[]:;"\'"|,.<>/?~`№';
const enabledPasswordLettersHashiedA = new Map();
const enabledPasswordLettersHashiedB = new Map();
const enabledPasswordLettersHashiedC = new Map();
const hash = new Map()
    .set('Fx0dp', '1')
    .set('Fx0kz', '0')
    .set('Fx0bG', '1')
    .set('Fx0Lh', '0')
    .set('Fx0xA', '1')
    .set('Fx0JH', '0')
    .set('Fx0pQ', '1')
    .set('Fx0Zh', '0')
    .set('Fx0Jk', '1')
    .set('Fx0RP', '0');

const getRandomString = (length: number) =>
{
    let string = '';

    for(let i = 0; i < length; i++) string += letters[pseudoRandomNumber(0, letters.length-1, undefined, undefined, undefined, null, null, undefined, true, true)];

    return string;
};
const getRandomCode = (length: number) =>
{
    let code = '';

    for(let i = 0; i < length; i++) code += numbers[pseudoRandomNumber(0, numbers.length-1, undefined, undefined, undefined, null, null, undefined, true, true)];

    return code;
};

for(let char of enabledPasswordLetters)
{
    enabledPasswordLettersHashiedA.set(char, char.codePointAt(0).toString(2));
    enabledPasswordLettersHashiedB.set(char.codePointAt(0).toString(2), char);
};

// Протитип:
for(let array of enabledPasswordLettersHashiedB)
{
    let hashed = '';
    
    for(let i of array[0]) hashed += getKey(array[0][Number(i)], hash)[0] + getRandomString(10);
    
    enabledPasswordLettersHashiedC.set(array[0], hashed);
};

const enterPassword = (password: string) =>
{
    let hashedPassword = '';
    
    for(let char of password)
    {
        const codeA = enabledPasswordLettersHashiedA.get(char);
        const codeB = enabledPasswordLettersHashiedC.get(codeA);
        hashedPassword += `${codeB}|`;
    };
    
    return hashedPassword;
};

const unHash = (hashedPass: any) =>
{
    let chars = new Map();

    for(let index in hashedPass)
    {
        let DcharIndex = hashedPass.indexOf('Fx0dp', index);
        let AcharIndex = hashedPass.indexOf('Fx0kz', index);
        let CcharIndex = hashedPass.indexOf('Fx0bG', index);
        let IcharIndex = hashedPass.indexOf('Fx0Lh', index);
        let HcharIndex = hashedPass.indexOf('Fx0xA', index);
        let RcharIndex = hashedPass.indexOf('Fx0JH', index);
        let NcharIndex = hashedPass.indexOf('Fx0pQ', index);
        let BcharIndex = hashedPass.indexOf('Fx0Zh', index);
        let EcharIndex = hashedPass.indexOf('Fx0Jk', index);
        let XcharIndex = hashedPass.indexOf('Fx0RP', index);
        let VcharIndex = hashedPass.indexOf('|', index);
        
        if(DcharIndex != -1) chars.set(DcharIndex, true);
        if(AcharIndex != -1) chars.set(AcharIndex, false);
        if(CcharIndex != -1) chars.set(CcharIndex, true);
        if(IcharIndex != -1) chars.set(IcharIndex, false);
        if(HcharIndex != -1) chars.set(HcharIndex, true);
        if(RcharIndex != -1) chars.set(RcharIndex, false);
        if(NcharIndex != -1) chars.set(NcharIndex, true);
        if(BcharIndex != -1) chars.set(BcharIndex, false);
        if(EcharIndex != -1) chars.set(EcharIndex, true);
        if(XcharIndex != -1) chars.set(XcharIndex, false);
        if(VcharIndex != -1) chars.set(VcharIndex, 'no');
    };
    
    let numbers = '';
    
    const sortChars = new Map([...chars.entries()].sort((a, b) => a[0] - b[0]));
    
    [...sortChars].find(([key, val]) =>
    {
        if(val === 'no') numbers += '|'
        else if(val) numbers += '1'
        else numbers += '0'
    });
    
    let unHasiedPassword = '';
    
    for(let char of numbers.split('|'))
    {
        if(!char) continue;
        unHasiedPassword += enabledPasswordLettersHashiedB.get(char)
    };

    return unHasiedPassword;
}
// const hashedPassword = enterPassword('АБВFOCKUSTY123');
// const unHasedPassword = unHash(hashedPassword);

export
{
    enterPassword,
    unHash,
    
    getRandomString,
    getRandomCode
}