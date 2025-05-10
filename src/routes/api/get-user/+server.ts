import supabase from '$lib/utils/supabase';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { username } = await request.json();

	const { data, error } = await supabase
		.from('dotme')
		.select('*')
		.eq('username', username)
		.single();

	if (error) {
		return json({ user: null });
	}

	return json({ user: data });
}
