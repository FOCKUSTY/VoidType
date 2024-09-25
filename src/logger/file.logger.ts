import Formatter from 'utility/service/formatter.service';

import path from 'path';
import fs from 'fs';

const dir = path.join('./');
const cache = new Map();

class Log {
    private readonly _prefix: string = '';
    private readonly _date = Formatter.Date(new Date(), 'dd.MM.yyyy');
    private readonly _file_path: string = '';

    private _cache: string = '';

    constructor(filePath?: string, prefix?: string) {
        this._prefix = prefix
            ? prefix + '-'
            : '';
        
        this._file_path = filePath
            ? filePath
            : path.join(dir, 'log', this._prefix + this._date) + '.log';

        this.init();

        this._cache = this.ReadFile();
        cache.set(this._file_path, this._cache);
    };

    private CreateFile() {
        if(!fs.readdirSync(path.join(dir, 'log')).includes(this._prefix + this._date + '.log')) {
            fs.writeFileSync(this._file_path, `====---- Hello! This is log file of ${this._date} ! ----====`);
        };
    };

    private CreateFolder() {
        if(!fs.readdirSync(dir).includes('log')) {
            fs.mkdirSync(path.join(dir, 'log'));
        };

        this.CreateFile();
    };

    private ReadFile() {
        return fs.readFileSync(path.join('./log', this._prefix + this._date + '.log'), 'utf-8');
    };

    private WriteFile = () => {
        fs.writeFileSync(this._file_path, cache.get(this._file_path), { encoding: 'utf-8' });
    };
    
    private readonly init = () => {
        this.CreateFolder();
    };

    public writeFile(text: string) {
        cache.set(this._file_path, cache.get(this._file_path) + '\n' + '[' + Formatter.Date(new Date(), 'HH:mm:ss') + '] ' + text);

        this.WriteFile();
    };

    public get file() {
        return this.ReadFile();
    };
};

export default Log;