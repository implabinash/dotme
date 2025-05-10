import supabase from '$lib/utils/supabase';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { username } = await request.json();

	const { data, error } = await supabase
		.from('dotme')
		.select('id')
		.eq('username', username)
		.single();

	if (error && error.code !== 'PGRST116') {
		return json({ available: false });
	}

	return json({ available: !data });
}
