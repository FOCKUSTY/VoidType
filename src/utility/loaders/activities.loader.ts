import type { Activity } from 'types/activities/standart-activity.type';
import { Debug } from 'develop/debug.develop';

import ClassStandartActivityLoader from './standart-activity.loader';
import ClassTypifiedActivityLoader from './typified-activity.loader';
import ClassUtilityLoader from './utility.loader';

import path from 'node:path';
import fs from 'node:fs';

import Logger from 'logger/index.logger';
import Formatter, { Colors } from 'utility/service/formatter.service';

const activitiesPath = path.join('../../the-void-database/data');
const activitiesFolders = fs
    .readdirSync(activitiesPath)
    .filter(file => !file.endsWith(".json"));

const StandartActivityLoader = new ClassStandartActivityLoader();
const TypifiedActivityLoader = new ClassTypifiedActivityLoader();
const UtilityLoader = new ClassUtilityLoader();

const LoadedActivities: { [key: string]: Activity[] } = {
    guild: [],
    name: [],
    kristy: [],
    other: []
};

const LoadedUtility: {
    banwords: any[],
    titles: {[key: string]: any[]},
    [key: string]: any[] |
    {[key: string]: any[]}
} = {
    banwords: [],
    titles: {}
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
                try {
                    const TypifiedActivities: Activity[] = TypifiedActivityLoader.execute(filePath);
                
                    if(fileName === 'guilds.json')
                        LoadedActivities.guild.push(...TypifiedActivities);
                    else if(fileName === 'names.json')
                        LoadedActivities.name.push(...TypifiedActivities);
                    else
                        LoadedActivities.other.push(...TypifiedActivities);

                    this.Logger('Загружен ' + Formatter.Colored(`${this.folder} / ${fileName}`, [Colors.yellow, Colors.yellow, Colors.green], ''), Colors.green);
                }
                catch (err) {
                    Debug.Error(err);
                    this.Logger(`Файл ${fileName} не был загружен успешно`, Colors.red);
                };

                continue fileCicle;
            }
            else {
                continue fileCicle;
            };
        };
    };

    private readonly ActivityLoader = () => {
        if(!this.jsonFiles || !this.activityFolderPath)
            return;

        const folder = path.parse(this.activityFolderPath).name;

        for(const fileName of this.jsonFiles) {
            try {
                const filePath = path.join(this.activityFolderPath, fileName);
                const Activities: Activity[] = StandartActivityLoader.execute(filePath);
                
                LoadedActivities.other.push(...Activities);

                this.Logger('Загружен ' + Formatter.Colored(`${folder} / ${fileName}`, [Colors.yellow, Colors.yellow, Colors.green], ''), Colors.green);
            } catch (err) {
                Debug.Error(err);

                this.Logger(`Файл ${fileName} не был загружен успешно`, Colors.red);
            };
        };
    };

    private readonly UtilityLoader = () => {
        if(!this.jsonFiles || !this.activityFolderPath)
            return;

        const folder = path.parse(this.activityFolderPath).name;

        if(folder !== 'utility')
            return;

        for(const fileName of this.jsonFiles) {
            try {
                const filePath = path.join(this.activityFolderPath, fileName);
                const name = path.parse(filePath).name;

                const data = UtilityLoader.execute(filePath);

                LoadedUtility[name] = data;
                
                this.Logger('Загружен ' + Formatter.Colored(`${folder} / ${fileName}`, [Colors.yellow, Colors.yellow, Colors.green], ''), Colors.green);
            } catch (err) {
                Debug.Error(err);

                this.Logger(`Файл ${fileName} не был загружен успешно`, Colors.red);
            };
        };
    };

    private readonly JSONCicle = () => {
        if(!this.jsonFiles || !this.activityFolderPath)
            return;

        const folder = path.parse(this.activityFolderPath).name;

        switch (folder) {
            case 'activities':
                this.ActivityLoader();

            case 'utility':
                this.UtilityLoader();

            default:
                break;
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

    public readonly reload = () => {
        this.clear();
        this.execute();
    };

    public readonly clear = () => {
        for(const key in LoadedActivities) {
            this.Logger(`Разгрузка ${key}-активностей`)
            LoadedActivities[key] = [];
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
    LoadedActivities as activities,
    LoadedUtility as utility
};

export default ActivitiesLoader;