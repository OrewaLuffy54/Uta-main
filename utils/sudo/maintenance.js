let maintenanceMode = false;

async function on() {
    maintenanceMode = true;

    return {
        success: true,
        title: '🟢 Maintenance Enabled',
        description: [
            '✅ Maintenance mode has been enabled.',
            '⚠️ New users can now be blocked if your command handlers check this flag.'
        ].join('\n')
    };
}

async function off() {
    maintenanceMode = false;

    return {
        success: true,
        title: '🔴 Maintenance Disabled',
        description: [
            '✅ Maintenance mode has been disabled.',
            '🎉 Bot is now operating normally.'
        ].join('\n')
    };
}

async function status() {
    return {
        success: true,
        title: '🛠 Maintenance Status',
        description:
            maintenanceMode
                ? '🟢 Maintenance Mode : ENABLED'
                : '🔴 Maintenance Mode : DISABLED'
    };
}

module.exports = {
    on,
    off,
    status
};