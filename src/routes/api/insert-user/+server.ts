import { json } from '@sveltejs/kit';
import supabase from '$lib/utils/supabase';

export async function POST({ request }) {
	const body = await request.json();
	const photoId = Math.floor(Math.random() * 10) + 1;

	const { data, error } = await supabase.from('dotme').insert([
		{
			username: body.username,
			name: body.name,
			about: body.about,
			address: body.userAddress,
			photo_id: photoId
		}
	]);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ success: true, data });
}
