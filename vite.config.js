import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { promisify } from 'util';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	
	resolve: {
		alias: {
			promisify: promisify
		}
	}
	
};

export default config;
