/*global module:false*/

/*Generated initially from grunt-init, heavily inspired by yo webapp*/

module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc'
      },
      target: ['*.js', 'bodies/*.js', 'constraints/*.js', 'forces/*.js', 'integrators/*.js']
    },

    jscs: {
      src: ['*.js', 'bodies/*.js', 'constraints/*.js', 'forces/*.js', 'integrators/*.js'],
      options: {
        config: '.jscsrc'
      }
    }
  });
  grunt.registerTask('test', [
    'jscs',
    'eslint'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);
};
