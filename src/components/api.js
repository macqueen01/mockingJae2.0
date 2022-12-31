import axios from 'axios';
import { address } from '$lib/settings'

export const fetchScrollsFromId = (id) => {
    return {
        url: `${address}/scrolls/browse?id=${id}`,
    }
}

