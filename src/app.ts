import { Telegraf } from "telegraf";
import { IconfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext, ISessionDataWrapper, SessionData } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import fetch from 'node-fetch';



class ZernovozMonitor{
    bot: Bot;
    constructor(bot: Bot) {
        this.bot = bot
    }

    async monitor() {
        const response = await fetch('http://zernovozam.ru/cpanel/timeslots/getWindows', {
            method: 'POST',
            headers: {
                Cookie: 'PHPSESSID=8b95vce5lciiv28el6371pt6r1;',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "exporter=4&receiver=5&count=1&date=2023-08-31&time=18%3A00&driver_phone=&culture=143&trader=6823&max=2&iqueue=1",
        });

        if (!response.url.includes('error=6')) {
            let sessions = (this.bot.session.DB as any).get('sessions').value() as ISessionDataWrapper[]
            sessions.forEach(session => {
                if (session.data.chatId !== undefined && session.data.courseLike) {
                    bot.bot.telegram.sendMessage(session.data.chatId, 'Есть Слоты!!')
                }
            });
        }
        else {
            console.log('Нет слотов');
        }
    }
    init() {
        let m = this;
        setInterval(() => {m.monitor()}, 5000)
    }
}


class Bot{
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    session: LocalSession<SessionData>;
    constructor(private readonly configService: IconfigService) {
        this.session = new LocalSession({ database: "sessons.json" });
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"))
        this.bot.use(
            this.session.middleware()
        );
    }

    init() {
        this.commands = [new StartCommand(this.bot)]
        for (const command of this.commands) {
            command.handle();
        }
        this.bot.launch();
    }
}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const bot = new Bot(new ConfigService());
// bot.bot.telegram.sendMessage()
const monitor = new ZernovozMonitor(bot);
monitor.init();
bot.init()

