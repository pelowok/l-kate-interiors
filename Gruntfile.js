'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      dev: {
        options: {
          port: 9000,
          base: 'dev',
          open: 'http://localhost:<%= connect.dev.options.port %>'
        }
      },
      prod: {
        options: {
          port: 8000,
          base: 'prod',
          open: 'http://localhost:<%= connect.prod.options.port %>'
        }
      }
    },
    less: {
      build: {
        options: {
          paths: ['dev/styles'],
          yuicompress: true
        },
        files: {
          'prod/styles/main.css': 'dev/styles/main.less'
        }
      },
      watch: {
        options: {
          paths: ['dev/styles'],
          dumpLineNumbers: 'comments'
        },
        files: {
          'dev/styles/main.css': 'dev/styles/main.less'
        }
      }
    },
    watch: {
      less: {
        files: ['dev/styles/{,*/}*.less'],
        tasks: ['less:watch']
      },
      files: ['dev/*'],
      options: {
        livereload: true,
        dateFormat: function(time) {
          grunt.log.writeln('Reload took ' + time + 'ms');
          grunt.log.writeln('Waiting for more changes...');
        },
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'dev/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'prod/img'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['connect', 'open', 'watch']);

  // Allows for production server by running 'grunt server:prod'
  grunt.registerTask('server', function (target) {
    if (target === 'prod') {
      grunt.task.run([
      'less:build',
      'imagemin',
      'connect:prod',
      'watch'
    ]);
    }

    grunt.task.run([
      'less:watch',
      'connect:dev',
      'watch'
    ]);
  });
};
