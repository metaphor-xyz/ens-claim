module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', () => "bash -c 'tsc'"],
};
