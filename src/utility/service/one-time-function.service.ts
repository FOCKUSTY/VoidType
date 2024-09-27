const functions = new Map();

class OneTimeFunction {
    public _func: (...[]) => any;
    public _name: string;
    public _funcParameters?: any[];

    constructor (name: string, func: () => any, funcParameters?: any[]) {
        functions.set(name, false);
        
        this._func = func;
        this._name = name;
        this._funcParameters = funcParameters;
    };

    public execute = (): any => {
        if(functions.get(this._name)) {
            return;
        } else {
            functions.set(this._name, true);
            
            return this._funcParameters
                ? this._func(...this._funcParameters)
                : this._func();
        };
    };
};

export default OneTimeFunction;