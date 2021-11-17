const loadGruntTasks = require('load-grunt-tasks');

module.exports = function (grunt) {
    loadGruntTasks(grunt, {
        pattern: ['grunt-*'],
    });
}