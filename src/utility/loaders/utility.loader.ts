import Formatter from "utility/service/formatter.service";
import { Debug } from "develop/debug.develop";

class UtilityLoader {
    public execute = (path: string): any[] | {[key: string]: any[]} => {
        const file = Formatter.FromJSONwithPath(path);

        let data: any[] | {[key: string]: any[]};

        if(Array.isArray(file)) {
            data = [];

            for(const element of file) {
                data.push(element);
            };
        } else {
            data = {};

            for(const key in file) {
                const value = file[key];

                data[key] = value;
            };
        };

        return data;
    };
};

export default UtilityLoader;