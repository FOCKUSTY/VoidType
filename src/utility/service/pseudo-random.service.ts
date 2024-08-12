import { Debug } from "develop/debug.develop";
import { Random as RandomJS } from "random-js";
import Array from "./array.service";

const Random = new RandomJS();
const randomNumber = Random.integer(0, 10000)

const PseudoRandomWithArray = (number: number, array: any[]): number =>
{
    const shuffled = Array.Shuffle(array);

    return array.indexOf(shuffled[number]);
};

const PseudoRandomHistory = (number: number, historyArray: number[], min=0, max=100, n=2, m=2): number => {
    const check = () => {
        for(let i of historyArray)
        {
            const iMin = i-m;
            const iMax = i+m;

            if( number === i || ( number > iMin && number < iMax ) )
            {
                Debug.Log([`Область определение от ${iMin} до ${iMax} число: ${number}`]);
                number = Random.integer(min, max);
                Debug.Log([`Новое число: ${number}`]);
            }
        };
    };

    for (let {} of historyArray) check();
    
    check();

    historyArray.push( number );

    if(historyArray.length > n)
    {
        historyArray.shift();
        historyArray.shift();
    };

    return number;
};

const PseudoRandomNumber = (min=0, max=100, historyArray: number[], yourArray?: any[], n=2, m=2, random=randomNumber) => {

    if(max - 100 < min)
        return Random.integer(min, max);

    const date = new Date();
    
    const time = date.getTime();
    const year = date.getFullYear();
    const miliseconds = date.getMilliseconds();

    let pseudoRandom: number = Math.floor((time % (year * miliseconds)) * random);
    const text: string = `${pseudoRandom}`.replace('.', '');

    const maxLength = `${max}`.length;

    pseudoRandom = Number( text.slice( Math.floor(text.length/2), Math.floor(text.length/2+maxLength) ) );

    const checkMax = () => {
        if(pseudoRandom > max)
        {
            pseudoRandom -= Random.integer(min, Math.floor(max / 2));

            checkMax();
        };
    };

    checkMax();

    if(yourArray)
        pseudoRandom = PseudoRandomWithArray(pseudoRandom, yourArray);

    if(historyArray && historyArray.length != 0)
        pseudoRandom = PseudoRandomHistory(pseudoRandom, historyArray, min, max, n, m);

    Debug.Log([`Генерация нового псевдо случайного числа от ${min} до ${max}: ${pseudoRandom}`]);

    return pseudoRandom;
};

class PseudoRandom {
    private historyArray = [];

    private _min: number;
    private _max: number;
    private _n: number;
    private _m: number;
    private _yourArray: any[]

    private _random: number;

    constructor(min=0, max=100, n=2, m=2, yourArray: any[]) {
        if(min === max)
            throw Debug.Error('min & max равны');

        this._min = min;
        this._max = min === max ? max+1 : max;
        this._n = n;
        this._m = m;

        this._yourArray = yourArray;

        this._random = Random.integer(this._min, this._max);
    };

    public static Number = PseudoRandomNumber;

    public execute = () => {
        PseudoRandomNumber(
            this._min, this._max,
            this.historyArray, this._yourArray,
            this._n, this._m,
            this._random
        );
    };
};

export default PseudoRandom;