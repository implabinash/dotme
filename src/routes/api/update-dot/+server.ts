import { json } from '@sveltejs/kit';
import supabase from '$lib/utils/supabase';

export async function POST({ request }) {
	const body = await request.json();

	const { data, error } = await supabase
		.from('dotme')
		.update({ total_dot_received: body.totalDotReceived })
		.eq('username', body.username)
		.select();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ success: true, data });
}
