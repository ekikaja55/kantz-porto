type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
	debug: (...args: unknown[]) => void;
	info: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
}

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

export function createLogger(namespace: string): Logger {
	const prefix = `[kantz:${namespace}]`;

	const log = (level: LogLevel, ...args: unknown[]) => {
		if (!isDev && (level === 'debug' || level === 'info')) {
			return;
		}

		const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
		const formattedPrefix = `${timestamp} ${prefix}`;

		switch (level) {
			case 'debug':
				console.debug(formattedPrefix, ...args);
				break;
			case 'info':
				console.info(formattedPrefix, ...args);
				break;
			case 'warn':
				console.warn(formattedPrefix, ...args);
				break;
			case 'error':
				console.error(formattedPrefix, ...args);
				break;
		}
	};

	return {
		debug: (...args: unknown[]) => log('debug', ...args),
		info: (...args: unknown[]) => log('info', ...args),
		warn: (...args: unknown[]) => log('warn', ...args),
		error: (...args: unknown[]) => log('error', ...args)
	};
}

export const logger = createLogger('App');
