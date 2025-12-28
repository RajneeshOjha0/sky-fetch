const config = require('../utils/config');
const chalk = require('chalk');

module.exports = {
    get: (key) => {
        const value = config.get(key);
        console.log(`${chalk.green(key)}: ${value}`);
    },
    set: (key, value) => {
        config.set(key, value);
        console.log(chalk.green(`Configuration updated: ${key} = ${value}`));
    },
    list: () => {
        const all = config.store;
        console.log(chalk.bold('Current Configuration:'));
        for (const [key, value] of Object.entries(all)) {
            console.log(`${chalk.cyan(key)}: ${value}`);
        }
    }
};
