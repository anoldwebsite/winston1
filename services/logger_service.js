const winston = require('winston');

dateFormat = () => {
    return new Date(Date.now()).toUTCString()
};

class LoggerService {

    constructor(route) {

        this.log_data = null;
        this.route = route;

        const logger = winston.createLogger(
            {
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File(
                        {
                            filename: `./logs/${route}.log`
                        }
                    )
                ],
                //format: winston.format.json(),
                format: winston.format.printf((info) => {
                    //Sat, 01 Feb 2020 09:50:13 GMT | INFO/DEBUG/ERROR | main.log(The file that log belongs to) | App started (The event that occured)
                    let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                    //                             | data:{"a": "a"} 
                    message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
                    //                                 | log_data:{"b": "b"}
                    message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                    return message
                }),
                exceptionHandlers: [
                    new winston.transports.File(
                        {
                            filename: `./logs/${route}-ex-uncaught.log`
                        }
                    )
                ]
            }
        );//function createLogger ends here.
        //By default, winston will exit after logging an uncaughtException. 
        //If this is not the behaviour you want, set exitOnError = false;
        //logger.exitOnError = false;
        this.logger = logger
    };//constructor ends here.

    setLogData(log_data) {
        this.log_data = log_data
    }
    async info(message) {
        this.logger.log('info', message);
    }
    async info(message, obj) {
        this.logger.log('info', message, { obj });
    }
    async debug(message) {
        this.logger.log('debug', message);
    }
    async debug(message, obj) {
        this.logger.log('debug', message, { obj });
    }
    async error(message) {
        this.logger.log('error', message);
    }
    async error(message, obj) {
        this.logger.log('error', message, { obj });
    }
}
module.exports = LoggerService