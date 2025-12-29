#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const configCommands = require('./commands/config');
const packageJson = require('../package.json');
const { detectShell, getHistoryPath } = require('./utils/shell');
const WatcherService = require('./services/watcher.service');
const BufferService = require('./services/buffer.service');

const program = new Command();

program
    .name('skyfetch')
    .description('SkyFetch CLI Agent - Capture and ship terminal logs')
    .version(packageJson.version);

// Config Commands
const config = program.command('config').description('Manage configuration');

config
    .command('get <key>')
    .description('Get a configuration value')
    .action(configCommands.get);

config
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(configCommands.set);

config
    .command('list')
    .description('List all configuration values')
    .action(configCommands.list);

// Start Command
program
    .command('start')
    .description('Start the log watcher agent')
    .action(async () => {
        console.log(chalk.cyan('Initializing SkyFetch Agent...'));

        const shell = detectShell();
        console.log(chalk.dim(`Detected Shell Environment: ${shell}`));

        const historyPath = getHistoryPath();
        if (!historyPath) {
            console.error(chalk.red('Error: Unable to locate shell history file.'));
            process.exit(1);
        }

        const bufferService = new BufferService();
        bufferService.start();

        const watcher = new WatcherService(historyPath, bufferService);
        await watcher.start();

        console.log(chalk.dim('Agent is running. Press Ctrl+C to terminate.'));

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log(chalk.yellow('\nInitiating graceful shutdown...'));
            bufferService.stop();
            process.exit(0);
        });
    });

// Global Error Handling
process.on('uncaughtException', (error) => {
    console.error(chalk.red('Critical Error: Uncaught Exception'));
    console.error(chalk.red(error.message));
    console.error(chalk.dim(error.stack));
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('Critical Error: Unhandled Rejection'));
    console.error(chalk.red(reason));
    // Do not exit immediately to allow pending operations to complete if possible
});

program.parse(process.argv);
