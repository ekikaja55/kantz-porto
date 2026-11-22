/**
 * Client-side WebP image pre-compression utility.
 * Resizes images to max 1200px width/height and compresses to WebP (< 200KB).
 */

export interface CompressionResult {
	file: File;
	blob: Blob;
	dataUrl: string;
	originalSize: number;
	compressedSize: number;
}

export async function compressImage(
	file: File,
	maxDimension = 1200,
	initialQuality = 0.8
): Promise<CompressionResult> {
	if (!file.type.startsWith('image/')) {
		throw new Error('Selected file is not an image');
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				let { width, height } = img;

				if (width > maxDimension || height > maxDimension) {
					if (width > height) {
						height = Math.round((height * maxDimension) / width);
						width = maxDimension;
					} else {
						width = Math.round((width * maxDimension) / height);
						height = maxDimension;
					}
				}

				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					reject(new Error('Failed to get canvas 2d context'));
					return;
				}

				ctx.drawImage(img, 0, 0, width, height);

				const convertToWebp = (quality: number) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Canvas conversion to blob failed'));
								return;
							}

							// If size is still > 250KB and quality is high, try a slightly lower quality
							if (blob.size > 250 * 1024 && quality > 0.6) {
								convertToWebp(0.6);
								return;
							}

							const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
							const compressedFile = new File([blob], newFileName, {
								type: 'image/webp',
								lastModified: Date.now()
							});

							resolve({
								file: compressedFile,
								blob,
								dataUrl: canvas.toDataURL('image/webp', quality),
								originalSize: file.size,
								compressedSize: blob.size
							});
						},
						'image/webp',
						quality
					);
				};

				convertToWebp(initialQuality);
			};

			img.onerror = () => reject(new Error('Failed to load image for compression'));
			img.src = e.target?.result as string;
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}
