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
      dist: {
        src: ['web/js/app.js', 'web/js/controllers/*.js', 'web/js/services/*.js'],
        dest: 'web/js/min/app.min.js',
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'web/js/min/app.min.js': ['web/js/min/app.min.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['web/**/*.js', 'web/**/*.less'],
        tasks: ['less', 'concat', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
};
