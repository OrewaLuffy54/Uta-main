const system = require('./system');

async function execute(category, action, client) {

    if (category === 'system') {

        switch (action) {

            case 'status':
                return await system.status(client);

            default:
                return {
                    success: false,
                    description: '❌ Unknown system action.'
                };

        }

    }

    return {
        success: false,
        description: '❌ Unknown category.'
    };

}

module.exports = {
    execute
};