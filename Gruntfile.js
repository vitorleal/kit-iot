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
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'web/**/*.js', '!web/js/min/*', 'web/**/*.less'],
        tasks: ['less', 'uglify']
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
  grunt.registerTask('compile', ['less', 'uglify']);
};
