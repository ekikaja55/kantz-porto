<script lang="ts">
	let {
		class: className = '',
		rounded = 'rounded-md'
	}: {
		class?: string;
		rounded?: string;
	} = $props();
</script>

<div
	class="animate-pulse bg-neutral-200 dark:bg-neutral-800 {rounded} {className}"
	aria-hidden="true"
></div>
