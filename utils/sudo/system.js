const os = require('os');

async function status(client) {
    return {
        success: true,
        title: '🖥️ Uta Developer Panel',
        description: [
            `🟢 Discord : Online`,
            `🌐 Servers : ${client.guilds.cache.size}`,
            `👥 Users : ${client.users.cache.size}`,
            `💾 Memory : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            `⚙️ Node : ${process.version}`,
            `🖥️ Platform : ${os.platform()}`
        ].join('\n')
    };
}

async function ping(client) {
    return {
        success: true,
        title: '🏓 Uta Ping',
        description: [
            `🏓 Gateway : ${client.ws.ping} ms`,
            `⚡ API : Available`
        ].join('\n')
    };
}

async function stats(client) {
    const guilds = client.guilds.cache.size;

    const users = client.guilds.cache.reduce(
        (total, guild) => total + guild.memberCount,
        0
    );

    return {
        success: true,
        title: '📊 Uta Statistics',
        description: [
            `🌐 Servers : ${guilds}`,
            `👥 Users : ${users}`,
            `📦 Commands : ${client.commands?.size || 0}`,
            `🏓 Ping : ${client.ws.ping} ms`,
            `💾 Memory : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            `🖥️ Platform : ${os.platform()}`
        ].join('\n')
    };
}

async function version() {
    return {
        success: true,
        title: '🚀 Version Information',
        description: [
            `📦 Bot : 1.0.0`,
            `⚙️ Node : ${process.version}`,
            `🤖 Discord.js : v14`,
            `🖥️ Platform : ${os.platform()}`,
            `💻 Architecture : ${os.arch()}`
        ].join('\n')
    };
}

module.exports = {
    status,
    ping,
    stats,
    version
};