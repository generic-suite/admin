import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    REACT_APP_ENV: 'development',
    REACT_APP_BASE_URL: 'http://localhost:3000',
    REACT_APP_FILE_URL: 'http://localhost:3000',
  },
});
