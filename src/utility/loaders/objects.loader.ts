import path from 'path';
import fs from 'fs';
import loggers from 'logger/index.logger';
import Formatter, { Colors } from 'utility/service/formatter.service';

const dataPath = path.join('../../the-void-database/data');
const files = fs.readdirSync(dataPath).filter(file => file.endsWith('.json'));

const objects: { [key: string]: any[] } = {
    download: [],
    idea: [],
    names: [],
};

const Loader = () => {
    loggers.Loader.execute('Загрузка объектов');

    for(const fileName of files) {
        const file = Formatter.FromJSONwithPath(`${dataPath}\\${fileName}`);
        
        objects[fileName.replace('.json', '')] = file;
        loggers.Loader.execute(`Загружен ${`${fileName}`}`, Colors.green);
    };
};

export {
    objects
};

export default Loader;