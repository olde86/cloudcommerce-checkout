module.exports = function ( grunt )
{
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourcemap : 'none',
          noCache   : true
        },
        files: {
          'dist/css/app.css' : 'app/sass/app.sass',
        }
      }
    },
    jade: {
      dist: {
        files:  [{
          expand: true,
          cwd: 'app/jade/',
          src: ['**/*.jade'],
          dest: 'dist/',
          ext: '.html'
        }]
      }
    },
    copy: {
      assets: {
        expand: true,
        cwd: 'app/assets/',
        src: '**',
        dest: 'dist/assets/'
      },
      js: {
        expand: true,
        cwd: 'app/js/',
        src: '**',
        dest: 'dist/js/'
      },
      css: {
        expand: true,
        cwd: 'app/css/',
        src: '**',
        dest: 'dist/css/'
      }
    },
    watch: {
      sass: {
        files: ['app/sass/**/*.sass'],
        tasks: ['sass']
      },
      jade: {
        files: ['app/jade/**/*.jade'],
        tasks: ['jade']
      },
      copy: {
        files: [
          'app/assets/**',
          'app/js/**',
          'app/css/**'
          ],
        tasks: [
          'copy:assets',
          'copy:js',
          'copy:css'
          ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [ 'sass', 'jade', 'copy', 'watch']);
}
