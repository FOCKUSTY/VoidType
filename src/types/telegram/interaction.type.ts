import { Context, NarrowedContext } from 'telegraf';

export type Interaction = Context | NarrowedContext<any, any>;