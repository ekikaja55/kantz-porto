import { browser } from '$app/env';

class PerformanceStore {
	performanceMode = $state<boolean>(false);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	init() {
		if (!browser) return;

		const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const saved = localStorage.getItem('kantz_performance_mode');

		if (saved !== null) {
			this.performanceMode = saved === 'true';
		} else {
			this.performanceMode = systemReducedMotion;
		}

		this.apply();

		window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
			if (localStorage.getItem('kantz_performance_mode') === null) {
				this.performanceMode = e.matches;
				this.apply();
			}
		});
	}

	set(enabled: boolean) {
		this.performanceMode = enabled;
		if (browser) {
			localStorage.setItem('kantz_performance_mode', String(enabled));
			this.apply();
		}
	}

	toggle() {
		this.set(!this.performanceMode);
		return this.performanceMode;
	}

	private apply() {
		if (!browser) return;
		if (this.performanceMode) {
			document.documentElement.setAttribute('data-performance-mode', 'true');
		} else {
			document.documentElement.removeAttribute('data-performance-mode');
		}
	}
}

export const performanceStore = new PerformanceStore();
