import chalk from "chalk";
import * as time from "../../time.js";

export default {
  name: "connected",
  execute() {
    console.log(
        chalk.green(`[${time.getTime()}] ` + "[MongoDB 상태]: 연결됨.")
    );
  },
};
