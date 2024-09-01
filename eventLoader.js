const fs = require('fs');

function loadEvents(client, directory) {
    const eventFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`${directory}/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
    }
}

module.exports = loadEvents;