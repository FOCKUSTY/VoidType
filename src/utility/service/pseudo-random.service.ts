import { Debug } from "develop/debug.develop";
import { Random as RandomJS } from "random-js";
import Array from "./array.service";

const Random = new RandomJS();

const history = new Map<string, number[]>();

class PseudoRandom {
    private readonly _historyArray: number[] = [];
    private readonly _yourArray: any[] = [];

    private readonly _min: number = 0;
    private readonly _max: number = 100;

    private readonly _n: number = 2;
    private readonly _m: number = 3;

    private readonly _logging: boolean = true;

    private _random: number;

    constructor(data?: {
        name: string,
        
        historyArray?: number[],
        yourArray?: any[],

        min?: number,
        max?: number,
        
        n?: number,
        m?: number,
        
        logging?: boolean
    } | [number, number, number[]?, any[]?, boolean?]) {
        if(Array.isArray(data)) {
            if(data[0] === data[1]) {
                data[1] += 1;

                Debug.Error('Min = Max, be careful, The Void fixed it ;3');
            }

            if(data[0] > data[1]) {
                const max = data[0];
                const min = data[1];

                data[0] = min;
                data[1] = max;

                Debug.Error('Min > Max, be careful, The Void fixed it ;3');
            };

            this._min = data[0];
            this._max = data[1];

            this._historyArray = data[2] || [];
            this._yourArray = data[3] || [];
            
            this._logging = data[4] || false;

            this._random = Random.integer(data[0], data[1]);
        }
        else if(data) {
            history.set(data.name, data.historyArray || []);
            
            this._historyArray = history.get(data.name) || [];
            this._yourArray = data.yourArray || [];
    
            this._min = data.min || 0;
            this._max = data.max || 100;
            
            this._n = data.n || 2;
            this._m = data.m || 3;
            
            this._random = Random.integer(data.min || 0, data.max || 100);
            this._logging = data.logging || false;
        };

        this._random = Random.integer(this._min, this._max);
    };

    public readonly Array = (number: number, yourArray: any[]=this._yourArray): number => {
        const shuffled = Array.Shuffle(yourArray);
    
        for(const i in yourArray) {
            const value = yourArray[i];

            if(JSON.stringify(value) === JSON.stringify(shuffled[number]))
                return Number(i);
        }
        
        return number;
    };

    public readonly History = (number: number, historyArray: number[]=this._historyArray): number => {
        const check = () => {
            for(const i of historyArray) {
                const iMin = i - this._m;
                const iMax = i + this._m;
    
                if(number === i || (number > iMin && number < iMax)) {
                    Debug.Log([`Область определение от ${iMin} до ${iMax} число: ${number}`]);
                    number = Random.integer(this._min, this._max);
                    Debug.Log([`Новое число: ${number}`]);
                };
            };
        };
    
        for(const _ of historyArray) check();
        
        check();
    
        historyArray.push(number);
    
        if(historyArray.length > this._n) {
            historyArray.shift();
            historyArray.shift();
        };

        return number;
    };

    public readonly Number = (
        min: number,
        max: number,
        historyArray: number[] = this._historyArray,
        yourArray: any[] = this._yourArray,
        logging?: boolean
    ): number => {
        if(max - 100 < min)
            return Random.integer(min, max);

        const time = new Date().getMilliseconds();

        let pseudoRandom: number = (this._random+time) ** 2;

        const text: string = `${pseudoRandom}`.replace('.', '');
        const maxLength = `${max}`.length;

        pseudoRandom = Number(text.slice(Math.floor(text.length/2), Math.floor(text.length/2+maxLength)));

        const checkMax = () => {
            if(pseudoRandom > max) {
                pseudoRandom -= Random.integer(min, Math.floor(max / 2));
    
                checkMax();
            };
        };
    
        checkMax();

        if(yourArray && yourArray.length !== 0)
            pseudoRandom = this.Array(pseudoRandom, yourArray);
    
        if(historyArray && historyArray.length !== 0)
            pseudoRandom = this.History(pseudoRandom, historyArray);
    
        if(historyArray && historyArray.length === 0)
            historyArray.push(pseudoRandom);
    
        if(logging)
            Debug.Log([`Генерация нового псевдо случайного числа от ${min} до ${max}: ${pseudoRandom}`]);

        this._random = pseudoRandom;

        return pseudoRandom;
    };

    public readonly execute = (): number => {
        return this.Number(this._min, this._max, this._historyArray, this._yourArray, this._logging);
    };
};

export default PseudoRandom;