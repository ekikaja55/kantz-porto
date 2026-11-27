/**
 * Transient status bar message state (Svelte 5 runes)
 */
let statusMessage = $state('');
let timer: ReturnType<typeof setTimeout> | undefined;

export function setStatusMessage(msg: string, durationMs = 3000) {
	statusMessage = msg;
	if (timer) clearTimeout(timer);
	if (msg && durationMs > 0) {
		timer = setTimeout(() => {
			if (statusMessage === msg) {
				statusMessage = '';
			}
		}, durationMs);
	}
}

export function getStatusMessage() {
	return statusMessage;
}
