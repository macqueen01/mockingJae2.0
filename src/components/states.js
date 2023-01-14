import { writable } from "svelte/store";

export const loggedIn = writable(true);

// scrolls_data stores scrolls buffer data as value,
// matched to scrolls_id as a key
// scrolls_data = {'1': <bufferObject>}
export const scrolls_data = writable({})