const config = require('../utils/config');
const chalk = require('chalk');

module.exports = {
    get: (key) => {
        const value = config.get(key);
        console.log(`${chalk.green(key)}: ${value}`);
    },
    set: (key, value) => {
        const schemaKeys = Object.keys(config.store); // This gets current keys, but better to check schema defaults if store is empty?
        // Actually config.store returns all items. 
        // Let's check against the schema definition which we can't easily access from the instance directly without exporting it.
        // But we know the valid keys: 'apiUrl', 'apiKey'.

        const validKeys = ['apiUrl', 'apiKey', 'exclude'];
        if (!validKeys.includes(key)) {
            console.error(chalk.red(`Error: Invalid configuration key '${key}'.`));
            console.log(chalk.yellow(`Valid keys are: ${validKeys.join(', ')}`));
            return;
        }

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
