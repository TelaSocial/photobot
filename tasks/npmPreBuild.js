import { rm, test, cp, sed } from 'shelljs';

// clear dist
rm('-rf', './dist/npm');

// check if a config file exists
if (test('-f', './config.js')) {
    console.log('you already have a config file');
} else {
    const envVars = [
        'BOT_TOKEN',
        'BOT_USERNAME',
        'GCLOUD_PROJECT',
        'STORAGE_BUCKET',
        'PORT'
    ];
    // check if the env vars exists to create a new config.js
    const missingVars = envVars.reduce((prev, varName) => (
        (process.env[varName] === undefined)
            ? prev.concat([varName])
            : prev
    ), []);
    if (missingVars.length > 0) {
        console.error(
            'Failed creating config.js, missing env vars:',
            missingVars.join(', ')
        );
        process.exit(1);
    }
    console.log('You don’t have a config file yet. Creating one…');
    cp('-f', 'config-sample.js', 'config.js');
    envVars.forEach(varName =>
        sed('-i', varName, process.env[varName], 'config.js')
    );
}
