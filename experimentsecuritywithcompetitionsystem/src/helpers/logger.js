const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;
const path = require('path');

const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.File({filename: path.join(__dirname, '/../logs', 'app-log.log')}),
    ]
});

module.exports = logger;