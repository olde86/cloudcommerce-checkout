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
//    jade: {
//      dist: {
//        files:  [{
//          expand: true,
//          cwd: 'app/jade/',
//          src: ['**/*.jade'],
//          dest: 'dist/',
//          ext: '.html'
//        }]
//      }
//    },
    jadephp: {
      options: {
        pretty: true
      },
      compile: {
        expand: true,
        cwd: 'app/jade/',
        src: ['**/*.jade'],
        dest: 'dist/',
        ext: '.php'
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
      },
      img: {
        expand: true,
        cwd: 'app/img/',
        src: '**',
        dest: 'dist/img/'
      }
    },
    watch: {
      sass: {
        files: ['app/sass/**/*.sass'],
        tasks: ['sass']
      },
//      jade: {
//        files: ['app/jade/**/*.jade'],
//        tasks: ['jade']
//      },
      jadephp: {
        files: ['app/jade/**/*.jade'],
        tasks: ['jadephp']
      },
      copy: {
        files: [
          'app/assets/**',
          'app/js/**',
          'app/css/**',
          'app/img/**'
          ],
        tasks: [
          'copy:assets',
          'copy:js',
          'copy:css',
          'copy:img'
          ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
//  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jade-php');

  grunt.registerTask('default', [ 'sass', 'jadephp', 'copy', 'watch']);
}
