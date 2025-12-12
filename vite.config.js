import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		hmr: {
			overlay: false
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Split vendor chunks for better caching
					vendor: ['svelte', '@sveltejs/kit'],
					auth: ['better-auth', '@auth/core', '@auth/sveltekit'],
					discord: ['discord.js'],
					ui: ['daisyui', '@tailwindcss/forms', '@tailwindcss/typography'],
					db: ['kysely', 'kysely-postgres-js', 'postgres', 'pg']
				}
			}
		}
	},
	optimizeDeps: {
		include: ['svelte', '@sveltejs/kit', 'better-auth'],
		exclude: ['emoji-datasource'] // Exclude heavy emoji library from pre-bundling
	}
});
