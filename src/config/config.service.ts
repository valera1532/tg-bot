import { get } from "http";
import { IconfigService } from "./config.interface";
import { DotenvParseOutput, config } from "dotenv";

export class ConfigService implements IconfigService{
    private config: DotenvParseOutput;
    constructor() {
        const { error, parsed } = config();
        if (error) {
            throw new Error(' не найден фойл .env')
        }
        if (!parsed) {
            throw new Error(' пустой файл')
        }
        this.config = parsed;
    }
    get(key: string): string {
        const res = this.config[key];
        if (!res) {
            throw new Error('нет такого ключа')
        }
        return res;
    }

}