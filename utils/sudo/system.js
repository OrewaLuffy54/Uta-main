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

module.exports = {
    status
};