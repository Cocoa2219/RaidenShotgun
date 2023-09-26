import * as time from "../../time.js";
import chalk from "chalk";

export default {
  name: "disconnected",
  execute() {
    console.log(
        chalk.red(`[${time.getTime()}] ` + "[MongoDB 상태]: 연결 끊어짐.")
    );
  },
};
