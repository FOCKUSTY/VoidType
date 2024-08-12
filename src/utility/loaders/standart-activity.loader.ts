import { Activity } from "types/activities/standart-activity.type";
import { THEVOIDs_CONSTANTS } from "src/index.constants";
import Formatter from "utility/service/formatter.service";

class StandartActivityLoader {
    public execute = (path: string): Activity[] => {
        const activities = [];

        const file = Formatter.FromJSONwithPath(path);
        
        for(const activity of file)
        {
            for(const key in THEVOIDs_CONSTANTS)
                if(activity.text.indexOf(`\$\{${key}\}`) !== -1)
                    activity.text = activity.text.replace(`\$\{${key}\}`, THEVOIDs_CONSTANTS[key]);

            activities.push(activity);
        };
    
        return activities;
    };
};

export default StandartActivityLoader;