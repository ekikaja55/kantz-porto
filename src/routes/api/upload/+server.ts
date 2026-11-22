import { json, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/private';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('Upload');

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return json({ error: 'No valid file provided' }, { status: 400 });
		}

		if (file.size > 2 * 1024 * 1024) {
			return json({ error: 'File size exceeds 2MB limit' }, { status: 400 });
		}

		const ext = file.name.split('.').pop() || 'webp';
		const fileName = `projects/${crypto.randomUUID()}.${ext}`;
		const supabaseUrl = PUBLIC_SUPABASE_URL || 'https://exxglpybfjdbkhqrwxgz.supabase.co';
		const supabaseKey = PUBLIC_SUPABASE_ANON_KEY || '';

		const uploadEndpoint = `${supabaseUrl}/storage/v1/object/img/${fileName}`;
		const arrayBuffer = await file.arrayBuffer();

		const response = await fetch(uploadEndpoint, {
			method: 'POST',
			headers: {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
				'Content-Type': file.type || 'image/webp'
			},
			body: arrayBuffer
		});

		if (!response.ok) {
			const errorData = await response.text();
			log.error('Supabase upload error:', errorData);
			return json({ error: 'Failed to upload to storage' }, { status: 502 });
		}

		const publicUrl = `${supabaseUrl}/storage/v1/object/public/img/${fileName}`;
		log.info(`Uploaded file successfully: ${publicUrl}`);
		return json({ url: publicUrl });
	} catch (err) {
		log.error('Upload handling error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
