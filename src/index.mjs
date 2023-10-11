// 임포트하기
import dotenv from 'dotenv';
dotenv.config();

import {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} from 'discord.js';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import * as time from './time.js';
import {fileURLToPath, pathToFileURL} from "url";
import {dirname} from 'path';


const mongoToken = "mongodb+srv://cocoa:1234@raidenshogun.bvynira.mongodb.net"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(
    chalk.cyan(`[${time.getTime()}] ` + "[Discord.js 상태]: 연결 중...")
);

// 클라이언트 인스턴스 새로 만들기
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.buttons = new Collection();
client.commands = new Collection();
export { client }
import { eventHandler } from './handlers/EventHandler.js';
import mongoose from "mongoose";

eventHandler(client);

// 슬래시 커맨드 읽기
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".mjs"));

// Assuming `commandFiles` contains a list of file names like in your previous code
for (const file of commandFiles) {
  const commandModulePath = pathToFileURL(path.resolve(__dirname, `./commands/${file}`));

  // Use dynamic import to load the module
  import(commandModulePath.href).then((module) => {
    if ("data" in module.default && "execute" in module.default) {
      const command = module.default;
      client.commands.set(command.data.name, command);
    } else {
      console.log(
          chalk.redBright(
              `[${new Date().getTime()}] ` +
              `[Discord.js 상태]: ${file}에 있는 커맨드는 data나 execute 프로퍼티가 없습니다.`
          )
      );
    }
  }).catch((error) => {
    console.error(`Error importing ${file}: ${error}`);
  });
}

// EventHandler.js 불러서 이벤트 핸들링하기
client.handleEvents();

// 로그인하기
try {
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.log(
      chalk.redBright(`[${time.getTime()}] ` + "[Discord.js 상태]: 연결 실패.")
  );
}

(async () => {
  mongoose.set("strictQuery", false);
  await mongoose
      .connect(mongoToken, { dbName: "RaidenShogun" })
      .catch(console.error);
})();