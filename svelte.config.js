import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Adapter for your environment
    adapter: adapter(),
    
    // Experimental options
    experimental: {
      remoteFunctions: true // enable remote functions (thin RPC)
    }
  },
  
  // Compiler options for top-level await in .svelte components
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  
  // Preprocessors
  preprocess: [mdsvex()],
  
  // File extensions
  extensions: ['.svelte', '.svx']
};

export default config;
