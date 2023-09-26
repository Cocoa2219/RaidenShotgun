import chalk from "chalk";
import * as time from "../../time.js";

export default {
  name: "err",
  execute(err) {
    console.log(
        chalk.red(`[${time.getTime()}] ` + `[MongoDB 상태]: 오류 발생 : ${err}`)
    );
  },
};
