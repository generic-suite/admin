import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    REACT_APP_ENV: 'production',
    REACT_APP_BASE_URL: 'http://localhost:10303/api',
    REACT_APP_FILE_URL: 'http://localhost:10303/api',
  },
});
