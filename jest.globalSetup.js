// Pin a timezone behind UTC so date tests catch UTC-vs-local parsing bugs.
module.exports = () => {
  process.env.TZ = 'America/New_York';
};
