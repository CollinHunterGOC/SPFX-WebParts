const gulp = require('gulp');

try {
  const build = require('@microsoft/sp-build-web');
  try {
    const ver = require('@microsoft/sp-build-web/package.json').version;
    console.log(`Loaded @microsoft/sp-build-web v${ver}`);
  } catch (e) {
    console.log('Loaded @microsoft/sp-build-web (version unknown)');
  }

  build.initialize(gulp);

  // Provide a convenience alias: `gulp serve` -> `gulp serve-deprecated`
  try {
    gulp.task('serve', gulp.series('serve-deprecated'));
  } catch (err) {
    // ignore if registration fails for some reason
  }
} catch (err) {
  console.error('ERROR: Failed to load @microsoft/sp-build-web. Details below:\n');
  console.error(err && err.stack ? err.stack : err);
  console.error('\nMake sure dependencies are installed (npm install) and you are running gulp from the project root.');
  process.exitCode = 1;
}