import { ActivityType } from 'discord.js';
import chalk from 'chalk';
import * as time from '../../time.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(
        chalk.greenBright(
            `[${time.getTime()}] ` +
            `[Discord.js 상태]: 봇 ${client.user.tag}으로 연결됨.`
        )
    );
    client.user.setActivity(
        `${client.guilds.cache.size} 서버에서 라노벨`,
        {
          type: ActivityType.Watching,
        }
    );
  },
};
