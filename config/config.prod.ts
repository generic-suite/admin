const { REACT_APP_ENV } = process.env;

export default defineConfig({
  define: {
    REACT_APP_ENV: 'development',
    REACT_APP_BASE_URL: 'http://127.0.0.1:3000',
    REACT_APP_FILE_URL: 'http://127.0.0.1:3000',
  },
});
