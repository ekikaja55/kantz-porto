export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

class ToastStore {
	toasts = $state<ToastItem[]>([]);

	show(message: string, type: ToastType = 'info', duration = 3000) {
		const id = crypto.randomUUID();
		const item: ToastItem = { id, message, type, duration };
		this.toasts = [...this.toasts, item];

		if (duration > 0) {
			setTimeout(() => {
				this.dismiss(id);
			}, duration);
		}
		return id;
	}

	success(message: string, duration = 3000) {
		return this.show(message, 'success', duration);
	}

	error(message: string, duration = 4000) {
		return this.show(message, 'error', duration);
	}

	info(message: string, duration = 3000) {
		return this.show(message, 'info', duration);
	}

	warning(message: string, duration = 3500) {
		return this.show(message, 'warning', duration);
	}

	dismiss(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
}

export const toast = new ToastStore();
