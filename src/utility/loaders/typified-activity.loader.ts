import { THEVOIDs_CONSTANTS } from "src/index.constants";
import { Activity } from "types/activities/standart-activity.type";
import Formatter from "utility/service/formatter.service";


class TypifiedActivityLoader {
    public execute = (path: string): Activity[] => {
        const file = Formatter.FromJSONwithPath(path);
        const activities = [];

        for(const activity of file.activities)
        {
            let activityText: string = activity;
            
            for(const key in THEVOIDs_CONSTANTS)
            {
                if(activityText.indexOf(`\$\{${key}\}`) !== -1)
                    activityText = activityText.replace(`\$\{${key}\}`, THEVOIDs_CONSTANTS[key]);
            };

            activities.push({text: activityText, type: file.type});
        };

        return activities;
    };
};

export default TypifiedActivityLoader;