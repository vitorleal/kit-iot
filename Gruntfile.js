module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        options: {
          paths: ['web/css', 'web/css/less', 'web/css/common'],
          cleancss: true
        },
        files: {
          'web/css/main.css': 'web/css/main.less'
        }
      }
    },
    concat: {
      options : {
        banner: '#!/usr/bin/env node\n\n'
      },
      bin: {
        src: 'index.js',
        dest: 'bin/index.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      main: {
        files: {
          'web/js/min/app.min.js': [
            '!web/js/min/*',
            'web/js/app.js',
            'web/js/controllers/*.js',
            'web/js/services/*.js',
            'web/js/directives/*.js'
          ]
        }
      }
    },
    replace: {
      bin: {
        src: '<%= concat.bin.dest %>',
        dest: '<%= concat.bin.dest %>',
        replacements: [{
          from: './',
          to: '../'
        }, {
          from: 'UA-XXXXXXX-XX',
          to: 'UA-5427757-50'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'web/**/*.js', '!web/js/min/*', 'web/**/*.less'],
        tasks: ['less', 'concat', 'uglify', 'replace']
      }
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['less', 'concat', 'uglify', 'replace']);
};
