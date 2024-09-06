import type { Activity } from 'types/activities/standart-activity.type';

import ClassStandartActivityLoader from './standart-activity.loader';
import ClassTypifiedActivityLoader from './typified-activity.loader';

import path from 'node:path';
import fs from 'node:fs';
import Logger from 'logger/index.logger';
import { Colors } from 'utility/service/formatter.service';

const activitiesPath = path.join('../../the-void-database/data');
const activitiesFolders = fs
    .readdirSync(activitiesPath)
    .filter(file => !file.endsWith(".json"));

const StandartActivityLoader = new ClassStandartActivityLoader();
const TypifiedActivityLoader = new ClassTypifiedActivityLoader();

const LoadedActivities: { [key: string]: Activity[] } = {
    guild: [],
    name: [],
    kristy: [],
    other: []
};

class ActivitiesLoader {
    private readonly Logger = new Logger('Loader').execute;

    private files?: string[];
    private jsonFiles?: string[];
    private folders?: string[];

    private activityFolderPath?: string;
    private folderPath?: string;
    private folder?: string;

    private readonly FeatureAcitivyLoader = () => {
        if(!this.files || !this.folderPath || !this.folder)
            return;

        fileCicle: for(const fileName of this.files) {
            const filePath = path.join(this.folderPath, fileName);

            if(this.folder === 'typified') {
                const TypifiedActivities: Activity[] = TypifiedActivityLoader.execute(filePath);
            
                if(fileName === 'guilds.json')
                    LoadedActivities.guild.push(...TypifiedActivities);
                else if(fileName === 'names.json')
                    LoadedActivities.name.push(...TypifiedActivities);
                else
                    LoadedActivities.other.push(...TypifiedActivities);
            
                this.Logger(`Загружен ${`${fileName}`}`, Colors.green)
                continue fileCicle;
            }
            else {
                continue fileCicle;
            };
        };
    };

    private readonly JSONCicle = () => {
        if(!this.jsonFiles || !this.activityFolderPath)
            return;

        for(const fileName of this.jsonFiles) {
            const filePath = path.join(this.activityFolderPath, fileName);
            const Activities: Activity[] = StandartActivityLoader.execute(filePath);
            
            LoadedActivities.other.push(...Activities);

            this.Logger(`Загружен ${`${fileName}`}`, Colors.green);
        };
    };

    private readonly FolderCicle = () => {
        if(!this.folders || !this.activityFolderPath)
            return;

        for(const folder of this.folders) {
            this.folderPath = path.join(this.activityFolderPath, folder);
            this.files = fs.readdirSync(this.folderPath);
            this.folder = folder;

            this.FeatureAcitivyLoader();
        };
    };

    public readonly execute = () => {
        this.Logger('Загрузка активностей');
    
        for(const activityFolder of activitiesFolders) {
            this.activityFolderPath = path.join(activitiesPath, activityFolder);
            
            this.jsonFiles = fs
                .readdirSync(this.activityFolderPath)
                .filter(file => file.endsWith(".json"));

            this.folders = fs
                .readdirSync(this.activityFolderPath)
                .filter(file => !file.endsWith(".json"));

            if(this.jsonFiles.length !== 0)
                this.JSONCicle();
            else
                this.FolderCicle();
        };
    };
};

export {
    LoadedActivities as activities
};

export default ActivitiesLoader;