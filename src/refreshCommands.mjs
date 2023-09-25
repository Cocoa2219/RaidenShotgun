import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
    .readdirSync(path.resolve(__dirname, "../src/commands"))
    .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(path.resolve(__dirname, `../commands/${file}`));
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
    try {
        await rest
            .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
            .then(() =>
                console.log(
                    chalk.greenBright("[Discord.js 상태]: 모든 커맨드를 삭제했습니다.")
                )
            )
            .catch(console.error);
        console.log(
            chalk.cyan(
                `[Discord.js 상태]: ${commands.length}개의 커맨드를 봇에 넣고 있습니다.`
            )
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands("1155866441137012786"), {
            body: commands,
        })

        console.log(
                chalk.greenBright(
                    `[Discord.js 상태]: ${data.length}개의 커맨드를 봇에 넣었습니다.`
                )
            );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
