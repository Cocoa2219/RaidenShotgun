import chalk from "chalk";
import * as time from "../../time.js";

export default {
  name: "connecting",
  execute() {
    console.log(
        chalk.cyan(`[${time.getTime()}] ` + "[MongoDB 상태]: 연결 중...")
    );
  },
};
