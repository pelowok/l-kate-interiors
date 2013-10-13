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
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['dev/scripts/**/*.js'],
        dest: 'prod/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js',
              'dev/**/*.js',
              ],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['bower_components/**']
      }
    },
    less: {
      build: {
        options: {
          paths: ['src/styles'],
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
      // tasks: ['jshint'],
      options: {
        livereload: true,
        dateFormat: function(time) {
          grunt.log.writeln('Reload took ' + time + 'ms');
          grunt.log.writeln('Waiting for more changes...');
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['connect', 'open', 'watch']);
  grunt.registerTask('test', ['jshint']);
  
  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'less:build']);

  // Allows for production server by running 'grunt server:prod'
  grunt.registerTask('server', function (target) {
    if (target === 'prod') {
      return grunt.task.run(['build']);
    }

    grunt.task.run([
      'connect:dev',
      'less:watch',
      'watch'
    ]);
  });
};
