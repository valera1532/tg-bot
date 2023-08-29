import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session);

            ctx.reply("Получать информацию о слотах?!",
                Markup.inlineKeyboard([
                Markup.button.callback("DA", "course_like"),
                Markup.button.callback("NET", "course_dislike"),
            ])
            )
        });
        this.bot.action("course_like", (ctx) => {
            let course: number = 5;
            ctx.session.courseLike = true;
            console.log(ctx.callbackQuery.message);

            if (ctx.callbackQuery.message != undefined) {
                ctx.session.chatId = ctx.callbackQuery.message.chat.id;
            }
            ctx.editMessageText('Следим за слотами')
        })
        this.bot.action("course_dislike", (ctx) => {
            ctx.session.courseLike = false;
            ctx.editMessageText("Окей не слежу")
        })
    }
}