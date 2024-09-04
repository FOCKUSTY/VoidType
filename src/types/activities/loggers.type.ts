export type LoggerName<T extends string> =
    'Activity' |
    'Commands' |
    'Events'   |
    'Fail'     |
    'Loader'   |
    'TheVoid'  |
    'Updater'  |
    T;