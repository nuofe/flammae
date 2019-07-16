/* eslint-disable import/no-extraneous-dependencies */
const semver = require('semver');
const spawn = require('cross-spawn');

const { version, name } = require('../package.json');

try {
    spawn.sync(
        'npm',
        ['config', 'set', 'registry', 'https://registry.npmjs.org'],
        {
            cwd: process.cwd(),
            stdio: 'inherit',
        },
    );
} catch (err) {
    process.exit(err);
}

let rawArgv;
try {
    rawArgv = JSON.parse(process.env.npm_config_argv);
} catch (error) {
    process.exit(error);
}
const cookedArgv = rawArgv.cooked;
const index = cookedArgv.indexOf('--otp');
let otp;
if (index !== -1) {
    otp = cookedArgv[index + 1];
}

if (version.indexOf('beta') !== -1) {
    const cmds = ['unpublish', `${name}@${version}`];
    if (otp) {
        cmds.push(`--otp=${otp}`);
    }
    const child = spawn('npm', cmds, {
        cwd: process.cwd(),
        stdio: 'inherit',
    });
    child.on('error', (err) => {
        process.exit(err);
    });
}

const newBetaVersion = semver.inc(version, 'prerelease', 'beta');

try {
    spawn.sync('npm', ['version', newBetaVersion], {
        cwd: process.cwd(),
        stdio: 'inherit',
    });
} catch (err) {
    process.exit(err);
}

const cmds = ['publish', '--tag=beta'];
if (otp) {
    cmds.push(`--otp=${otp}`);
}

const child = spawn('npm', cmds, {
    cwd: process.cwd(),
    stdio: 'inherit',
});
child.on('error', (err) => {
    process.exit(err);
});
