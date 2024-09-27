import winston from "winston";
import 'express-async-errors'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    const consoleTransport = new winston.transports.Console({ format: winston.format.simple() });
    logger.add(consoleTransport);
}

process.on('unhandledRejection', (ex) => {
    throw ex;
});

export default logger;