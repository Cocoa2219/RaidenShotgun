import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import {dirname} from 'path';
import pkg from 'mongoose';
const {connection} = pkg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const eventHandler = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(path.resolve(__dirname, '../events'));
    for (const folder of eventFolders) {
      const eventFiles = fs
          .readdirSync(path.resolve(__dirname, `../events/${folder}`))
          .filter((file) => file.endsWith('.js'));
      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            import(`../events/${folder}/${file}`)
                .then((module) => {
                  const event = module.default || module;
                  if (event.once) {
                    client.once(event.name, (...args) =>
                        event.execute(...args, client)
                    );
                  } else {

                    client.on(event.name, (...args) =>
                        event.execute(...args, client)
                    );
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
          }
          break;
      case "mongo":
          for (const file of eventFiles) {
              import(`../events/${folder}/${file}`)
                  .then((module) => {
                      const event = module.default || module;
                      if (event.once) {
                          connection.once(event.name, (...args) =>
                              event.execute(...args, client)
                          );
                      } else {
                          connection.on(event.name, (...args) =>
                              event.execute(...args, client)
                          );
                      }
                  })
          }
          break;
        default:
          break;
      }
    }
  };
};
