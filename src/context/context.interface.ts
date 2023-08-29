import { Context } from "telegraf";

export interface SessionData{
    courseLike: boolean;
    chatId: number | undefined;
}

export interface IBotContext extends Context{
    session: SessionData;
}
export interface ISessionDataWrapper {
    data: SessionData;
}