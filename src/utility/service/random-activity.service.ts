import { ActivityType, Client as DiscordClient } from "discord.js";

import { ActivityTypes } from "types/activities/activities.enum";
import { Activity } from "types/activities/standart-activity.type";

import { Debug } from 'develop/debug.develop';
import loggers from 'logger/index.logger';

import { activities as loadedActivities } from "utility/loaders/activities.loader";
import ClientLoader from "utility/loaders/client.loader";

import PseudoRandom from "./pseudo-random.service";
import Formatter from "./formatter.service";
import Array from "./array.service";

const historyObject = new Map();

export const RandomServiceActivity = async (Client: DiscordClient, type: 'user'|'guild'|'name'): Promise<Activity|void> => {
    try {
        const history = historyObject.get(type) ? historyObject.get(type) : [];
        historyObject.set(type, history);

        const activities = Array.Shuffle(loadedActivities[type === 'guild' ? 'guild' : 'name']);
        
        const randomActivityNumber = PseudoRandom.Number(0, activities.length-1, history, activities);
        const randomActivity = activities[randomActivityNumber];
    
        const array = ClientLoader.Get(type);
    
        const firstRandomElementNumber = PseudoRandom.Number(0, array.length-1, history, array);
        const secondRandomElementNumber = PseudoRandom.Number(0, array.length-1, history, array);
    
        const firstRandomElement = array[firstRandomElementNumber];
        const secondRandomElement = array[secondRandomElementNumber];
    
        const text = randomActivity.text
            .replace('{random}', firstRandomElement)
            .replace('{randomTwo}', secondRandomElement);
    
        const activityType = ActivityTypes[randomActivity.type];
    
        Debug.Log([`Случайные элементы: ${firstRandomElement} & ${secondRandomElement} из ${array.length}`]);

        Client.user?.setActivity({ name: text, type: Number(activityType)});
    
        return { text: text, type: randomActivity.type };
    } catch (err) {
        return Debug.Error(err);
    };
};

const RandomnessActivity = async (Client: DiscordClient): Promise<Activity|void> => {
    try {
        const history = historyObject.get('activities') ? historyObject.get('activities') : [];
        historyObject.set('activities', history);

        const activities = Array.Shuffle(loadedActivities['other']);
        
        const randomActivityNumber = PseudoRandom.Number(0, activities.length-1, history, activities);
        const randomActivity = activities[randomActivityNumber];

        const activityType = ActivityTypes[randomActivity.type];

        Client.user?.setActivity({ name: randomActivity.text, type: Number(activityType)});
    
        return { text: randomActivity.text, type: randomActivity.type };
    } catch (err) {
        return Debug.Error(err);
    };
};

export const RandomActiviy = async (Client: DiscordClient) => {
    if(!Client.user)
        return;

    const history = historyObject.get('number-activity') ? historyObject.get('activities') : [];
    historyObject.set('number-activity', history);

    const randomChance = PseudoRandom.Number(0, 100, history);
    const Log = (activity: Activity|void) =>
    {
        if(!activity)
            return;

        return loggers.Activity.execute(`Устанавливаю активность: "${activity.text}", тип: ${activity.type}`);
    };

    Debug.Log(['Chance:', randomChance]);

    if(randomChance <= 10)
    {
        const length = ClientLoader.guilds.length;
        const word = Formatter.RuWords(length, ['сервере', 'серверах', 'серверах']);

        const text = `Я уже на ${length} ${word}`;
        Client.user.setActivity({ name: text, type: ActivityType.Custom });

        return Log({text, type: 'custom'});
    }

    if(randomChance >= 10 && randomChance <= 40)
    {
        let type: 'user'|'guild'|'name';

        if(randomChance >= 10 && randomChance <= 20) type = 'user';
        else if(randomChance >= 20 && randomChance <= 30) type = 'guild';
        else type = 'name';

        const activity = await RandomServiceActivity(Client, type);

        return Log(activity);
    };

    if(randomChance >= 40)
    {
        const activity = await RandomnessActivity(Client);
        
        return Log(activity);
    };
};