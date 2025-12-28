const os = require('os');
const path = require('path');
const fs = require('fs');

const detectShell = () => {
    // Check for PowerShell specific environment variable
    if (process.env.PSModulePath) {
        return 'powershell';
    }

    const shellPath = process.env.SHELL || process.env.COMSPEC;
    if (!shellPath) return 'unknown';

    if (shellPath.toLowerCase().includes('powershell') || shellPath.toLowerCase().includes('pwsh')) {
        return 'powershell';
    }
    if (shellPath.toLowerCase().includes('cmd.exe')) {
        return 'cmd';
    }
    if (shellPath.toLowerCase().includes('bash')) {
        return 'bash';
    }
    if (shellPath.toLowerCase().includes('zsh')) {
        return 'zsh';
    }
    return 'unknown';
};

const getHistoryPath = () => {
    const shell = detectShell();
    const homeDir = os.homedir();

    if (shell === 'powershell') {
        // Standard PowerShell history path on Windows
        // %APPDATA%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
        const appData = process.env.APPDATA;
        if (appData) {
            const legacyPath = path.join(appData, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt');
            if (fs.existsSync(legacyPath)) return legacyPath;
        }

        // Check for PowerShell Core (pwsh)
        // %APPDATA%\Microsoft\PowerShell\PSReadLine\ConsoleHost_history.txt
        if (appData) {
            const corePath = path.join(appData, 'Microsoft', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt');
            if (fs.existsSync(corePath)) return corePath;
        }
    }

    if (shell === 'bash') {
        return path.join(homeDir, '.bash_history');
    }

    if (shell === 'zsh') {
        return path.join(homeDir, '.zsh_history');
    }

    return null;
};

module.exports = {
    detectShell,
    getHistoryPath
};
