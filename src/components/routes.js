
import { writable } from "svelte/store";

let routes = {
    scrolls: writable(false),
    
}

export const scrolls = writable(false);

