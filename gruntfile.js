const os = require('os')
const loadGruntTasks = require('load-grunt-tasks');

let arch = os.arch();
if (arch === 'x64') {
    arch = 'amd64';
}

module.exports = function (grunt) {
    loadGruntTasks(grunt, {
        pattern: ['grunt-*'],
    });

    grunt.initConfig({
        env: gruntConfig.env,
        shell: gruntConfig.shell
    });


    grunt.registerTask('start:server', `shell:start_backend:linux:${arch}`)
    grunt.registerTask('start:client', `shell:start_frontend:${arch}`)
    grunt.registerTask('start', ['start:server', 'start:client'])
}

function shell_download_depends(platform, arch, type) {
    switch (type) {
        case 'backend':
            return 'cd ./api && yarn'
    }
}

function shell_start_frontend(platform, arch) {
    return 'cd ./client && npm run serve'
}

function shell_start_backend(platform, arch) {
    return 'nodemon ./api/server.ts'
}

const gruntConfig = {};

gruntConfig.env = {
    dev: {
        NODE_ENV: 'development',
    },
    prod: {
        NODE_ENV: 'production',
    },
    testing: {
        NODE_ENV: 'testing',
    },
};

gruntConfig.shell = {
    start_backend: { command: shell_start_backend},
    start_frontend: { command: shell_start_frontend },
    download_depends: { command: shell_download_depends }
};