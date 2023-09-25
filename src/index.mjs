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


console.log(
  chalk.cyan(`[${time.getTime()}] ` + "[Discord.js 상태]: 연결 중...")
);

// 클라이언트 인스턴스 새로 만들기
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.buttons = new Collection();
client.commands = new Collection();
module.exports.client = client;
require(`./handlers/EventHandler`)(client);

// 슬래시 커맨드 읽기
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      chalk.redBright(
        `[${time.getTime()}] ` +
          `[Discord.js 상태]: ${filePath}에 있는 커맨드는 data나 execute 프로퍼티가 없습니다.`
      )
    );
  }
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