var yml = require('yml');
var enhancedEnv = yml.load('env.yml');

process.env = Object.assign(enhancedEnv, process.env);

const setupFiles = ["./test/setup.ts"];

var config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        "./src/**/*",
        "!./src/env.d.ts"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/aws/",
        "/coverage/",
        "/src/",
        "/test/utils/"
    ],
    setupFiles
};

if (!process.env.CI) {
    setupFiles.push("./test/cucumber.config.js");
    config.setupFiles = setupFiles;
}

module.exports = config;
