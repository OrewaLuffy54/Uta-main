const config = require('../../config');

function isOwner(userId) {
    return config.bot.ownerIds.includes(userId);
}

module.exports = {
    isOwner
};