import * as util from 'util';

/**
 * Logger class for structured and consistent logging.
 */
export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    /**
     * Logs an informational message.
     * @param message The message to log.
     * @param metadata Optional additional data for context.
     */
    public info(message: string, metadata?: any): void {
        this.log('INFO', message, metadata);
    }

    /**
     * Logs a warning message.
     * @param message The warning message to log.
     * @param metadata Optional additional data for context.
     */
    public warn(message: string, metadata?: any): void {
        this.log('WARN', message, metadata);
    }

    /**
     * Logs an error message.
     * @param message The error message to log.
     * @param metadata Optional additional data for context.
     */
    public error(message: string, metadata?: any): void {
        this.log('ERROR', message, metadata);
    }

    /**
     * Logs a debug message.
     * @param message The debug message to log.
     * @param metadata Optional additional data for context.
     */
    public debug(message: string, metadata?: any): void {
        this.log('DEBUG', message, metadata);
    }

    /**
     * Internal method for structured logging.
     * @param level Log level (e.g., INFO, ERROR).
     * @param message The message to log.
     * @param metadata Optional additional data.
     */
    private log(level: string, message: string, metadata?: any): void {
        const timestamp = new Date().toISOString();
        const logObject = {
            timestamp,
            level,
            context: this.context,
            message,
            ...(metadata && { metadata }),
        };

        // Format the log object as a string
        const formattedLog = util.format('%j', logObject);

        // Output the log based on level
        if (level === 'ERROR') {
            console.error(formattedLog);
        } else {
            console.log(formattedLog);
        }
    }
}