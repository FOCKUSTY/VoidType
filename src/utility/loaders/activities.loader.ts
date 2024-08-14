import type { Activity } from 'types/activities/standart-activity.type';

import ClassStandartActivityLoader from './standart-activity.loader';
import ClassTypifiedActivityLoader from './typified-activity.loader';

import path from 'node:path';
import fs from 'node:fs';
import loggers from 'logger/index.logger';
import { Colors } from 'utility/service/formatter.service';
import { Debug } from 'src/develop/debug.develop';

const activitiesPath = path.join('../the-void-database/data');
const activitiesFolders = fs.readdirSync(activitiesPath).filter(file => !file.endsWith(".json"));

const StandartActivityLoader = new ClassStandartActivityLoader();
const TypifiedActivityLoader = new ClassTypifiedActivityLoader();

const LoadedActivities: any = {
    guild: [],
    name: [],
    kristy: [],
    other: []
};

const Loader = () => {
    loggers.Loader.execute('Загрузка активностей');

    for(const activityFolder of activitiesFolders) {
        const activityFolderPath = path.join(activitiesPath, activityFolder);
        const jsonFiles = fs.readdirSync(activityFolderPath).filter(file => file.endsWith(".json"));
        const folders = fs.readdirSync(activityFolderPath).filter(file => !file.endsWith(".json"));
    
        if(jsonFiles.length !== 0)
        {
            for(const fileName of jsonFiles)
            {
                const filePath = path.join(activityFolderPath, fileName);
                const Activities: Activity[] = StandartActivityLoader.execute(filePath);
                
                LoadedActivities.other.push(...Activities);

                loggers.Loader.execute(`Загружен ${`${fileName}`}`, Colors.green);
            };
        }
        else
        {
            for(const folder of folders)
            {
                const folderPath = path.join(activityFolderPath, folder);
                const files = fs.readdirSync(folderPath);

                fileCicle: for(const fileName of files)
                {
                    const filePath = path.join(folderPath, fileName);

                    if(folder === 'typified')
                    {
                        const TypifiedActivities: Activity[] = TypifiedActivityLoader.execute(filePath);

                        if(fileName === 'guilds.json')
                            LoadedActivities.guild.push(...TypifiedActivities);
                        else if(fileName === 'names.json')
                            LoadedActivities.name.push(...TypifiedActivities);
                        else
                            LoadedActivities.other.push(...TypifiedActivities);

                        loggers.Loader.execute(`Загружен ${`${fileName}`}`, Colors.green)
    
                        continue fileCicle;
                    }
                    else
                    {
                        continue fileCicle;
                    }
                };
            };
        };
    };
};

export {
    LoadedActivities as activities
};

export default Loader;