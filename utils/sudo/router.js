const system = require('./system');
const processModule = require('./process');
const maintenance = require('./maintenance');

async function execute(category, action, client) {

    switch (category) {

        case 'system':

            switch (action) {

                case 'status':
                    return await system.status(client);

                case 'ping':
                    return await system.ping(client);

                case 'stats':
                    return await system.stats(client);

                case 'version':
                    return await system.version(client);

                default:
                    return {
                        success: false,
                        description: '❌ Unknown system action.'
                    };
            }

        case 'process':

            switch (action) {

                case 'reload':
                    return await processModule.reload(client);

                case 'restart':
                    return await processModule.restart(client);

                case 'shutdown':
                    return await processModule.shutdown(client);

                default:
                    return {
                        success: false,
                        description: '❌ Unknown process action.'
                    };
            }

        case 'maintenance':

            switch (action) {

                case 'on':
                    return await maintenance.on();

                case 'off':
                    return await maintenance.off();

                case 'status':
                    return await maintenance.status();

                default:
                    return {
                        success: false,
                        description: '❌ Unknown maintenance action.'
                    };
            }

        default:
            return {
                success: false,
                description: '❌ Unknown category.'
            };

    }

}

module.exports = {
    execute
};