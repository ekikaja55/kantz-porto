<script lang="ts">
	import Icon from '@iconify/svelte';
	import { compressImage } from '#lib/utils/image-compress';
	import { toast } from '#lib/stores/toast.svelte';

	let { images = $bindable([]) }: { images?: string[] } = $props();

	let isUploading = $state(false);
	let fileInputEl: HTMLInputElement | null = $state(null);

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		if (images.length >= 3) {
			toast.warning('Maximum 3 images allowed per project.');
			return;
		}

		const file = files[0];
		isUploading = true;

		try {
			// 1. Client-side WebP compression (< 200KB, max 1200px)
			const compressed = await compressImage(file, 1200, 0.8);

			// 2. Upload to Supabase Storage via /api/upload
			const formData = new FormData();
			formData.append('file', compressed.file);

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Failed to upload image');
			}

			const data = await res.json();
			images = [...images, data.url];
			toast.success('Image compressed and uploaded successfully.');
		} catch (err) {
			console.error('[Upload Error]', err);
			toast.error(err instanceof Error ? err.message : 'Upload failed');
		} finally {
			isUploading = false;
			if (fileInputEl) fileInputEl.value = '';
		}
	}

	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
		toast.info('Image removed from project.');
	}
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<label for="project-images-input" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
			Project Screenshots / Gallery (Max 3, WebP Optimized)
		</label>
		<span class="font-mono text-xs text-neutral-400">
			{images.length}/3 images
		</span>
	</div>

	<!-- Hidden input for standard form submission -->
	<input type="hidden" name="images" value={JSON.stringify(images)} />

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
		{#each images as imgUrl, index (imgUrl)}
			<div class="group relative aspect-video overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
				<img
					src={imgUrl}
					alt="Project preview {index + 1}"
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<button
					type="button"
					onclick={() => removeImage(index)}
					aria-label="Remove image {index + 1}"
					class="absolute top-2 right-2 rounded-lg bg-black/70 p-1.5 text-white opacity-90 transition-opacity hover:bg-red-600 hover:opacity-100 focus:outline-hidden"
				>
					<Icon icon="solar:trash-bin-trash-bold-duotone" class="size-4" />
				</button>
			</div>
		{/each}

		{#if images.length < 3}
			<label
				for="project-images-input"
				class="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-400 hover:bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:border-neutral-700"
			>
				{#if isUploading}
					<Icon icon="solar:refresh-bold-duotone" class="size-6 animate-spin text-neutral-500" />
					<span class="mt-2 text-xs font-medium text-neutral-500">Compressing & Uploading...</span>
				{:else}
					<Icon icon="solar:camera-add-bold-duotone" class="size-6 text-neutral-400" />
					<span class="mt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Add Screenshot</span>
					<span class="text-[10px] text-neutral-400">Auto WebP &lt; 200KB</span>
				{/if}
				<input
					id="project-images-input"
					bind:this={fileInputEl}
					type="file"
					accept="image/*"
					disabled={isUploading}
					onchange={handleFileSelect}
					class="sr-only"
				/>
			</label>
		{/if}
	</div>
</div>
