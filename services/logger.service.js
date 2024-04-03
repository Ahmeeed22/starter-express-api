const winston = require('winston');   
require("dotenv").config();

// date+ logg level + message
const dateFormate=()=>{
    return new Date(Date.now()).toLocaleString();
}
class LoggerService{  
    constructor (route){
        this.route=route ;
        const logger = winston.createLogger({
            level:'info',
            format: winston.format.printf(info=>{
                let message =`${dateFormate()} | ${info.level.toUpperCase()} | ${info.message}`
                message =info.obj ?message+`date${JSON.stringify(info.obj)} |` :message ;
                // console.log("test message",message);
                return message ;
            }),
            // winston.transports.Console() 
            transports: [
              new (winston.transports.Console)({ level: 'info' }),,
              new winston.transports.File({ filename: `${process.env.LOG_FILE_PATH}/${route}.log`,level: 'info'}),
            ],
          });
          this.logger=logger ;
    }
    
    async info (message){
        this.logger.log('info', message)
    }
    
    async info (message,obj){
        this.logger.log('info',message , {obj})
    }
    
    async error (message){
        this.logger.log('error', message)
    }

    async error (message,obj){
        this.logger.log('error',message , {obj})
    }

    async debug (message){
        this.logger.log('debug', message)
    }

    async debug (message,obj){
        this.logger.log('debug',message , {obj})
    }
}

module.exports =LoggerService ;