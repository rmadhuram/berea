/**
 * Grunt configuration file sass + angular
 */

module.exports = function(grunt) {

  var appConfig = {
    dist: 'dist',
    tmp: '.tmp'
  }

  grunt.initConfig ({

    config: appConfig,

    clean: {
      dist: [appConfig.tmp, appConfig.dist],
      tmp: [appConfig.tmp]
    },

    /**
     * Compiles all SASS files to CSS (into the .tmp/css directory)
     * https://github.com/gruntjs/grunt-contrib-sass
     */
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'client/sass',
          src: ['**/*.scss'],
          dest: '.tmp/css',
          ext: '.css'
        }]
      }
    },

    /**
     * Run tasks whenever watched files change. Livereload enabled.
     * https://github.com/gruntjs/grunt-contrib-watch
     */
    watch: {
      sass: {
        files: ['client/sass/**/*.scss'],
        tasks: ['sass', 'cssmin', 'copy:css'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['client/app/**/*.js'],
        tasks: ['neuter', 'file_append', 'copy:js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['client/app/**/*.html'],
        tasks: ['copy:templates'],
        options: {
          livereload: true
        }
      }
    },

    /**
     * Concatenate source files in the order of dependencies.
     * https://github.com/trek/grunt-neuter
     */
    neuter: {
      options: {
        basePath: 'client/app/'
      //  includeSourceMap: true
      },
      application: {
        src: 'client/app/**/*.js',
        dest: '<%= config.tmp %>/js/app-build-pre.js'

      },
    },

    file_append: {
      default_options: {
        files: {
          '.tmp/js/app-build.js': {
            prepend: "'use strict';\n",
            input: '<%= config.tmp %>/js/app-build-pre.js'
          }
        }
      }
    },

    /**
     * compress and concatenate all source css files into app-cssmin.css
     * https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      dist: {
        files: {
          '<%= config.tmp %>/concat/css/app-cssmin.css': [
             '<%= config.tmp %>/css/{,*/}*.css'
          ]
        }
      }
    },

    /**
     * useminPrepare & usemin - Replaces references to non-optimized scripts or stylesheets into a set of HTML files.
     * https://github.com/yeoman/grunt-usemin
     */
    useminPrepare: {
      html: 'client/index.html',
      options: {
        dest: '<%= config.dist %>'
      }
    },

    usemin: {
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/css/{,*/}*.css'],
      options: {
        dirs: ['<%= config.dist %>']
      }
    },

    /**
     * Copy files and folders.
     * https://github.com/gruntjs/grunt-contrib-copy
     */
    copy: {
      templates: {
        expand: true,
        dot: true,
        cwd: 'client/app',
        dest: '<%= config.dist %>/app',
        src: ['**/*.html']
      },

      index: {
        src: 'client/index.html',
        dest: '<%= config.dist %>/index.html'
      },

      img: {
        expand: true,
        dot: true,
        cwd: 'client/img',
        dest: '<%= config.dist %>/img',
        src: ['**/*']
      },

      data: {
        expand: true,
        dot: true,
        cwd: 'client/data',
        dest: '<%= config.dist %>/data',
        src: ['**/*']
      },

      js: {
        files: [{
          src: ['<%= config.tmp %>/concat/js/libs.js'],
          dest: '<%= config.dist %>/js/libs.js'
        },{
          expand: true,
          cwd: '<%= config.tmp %>/js/',
          src: ['*'],
          dest: '<%= config.dist %>/js/'
        }]
      },

      dist: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/dist/fonts',
          src: ['*'],
          dest: '<%= config.dist %>/fonts/'
        },{
          expand: true,
          cwd: 'client/fonts',
          src: ['*'],
          dest: '<%= config.dist %>/fonts/'
        }]
      },

      css: {
        src: ['<%= config.tmp %>/concat/css/app-cssmin.css'],
        dest: '<%= config.dist %>/css/app-cssmin.css'
      },

      configDev: {
        src: ['client/config/env-development.js'],
        dest: '<%= config.dist %>/js/env.js'
      },

      configProd: {
        src: ['client/config/env-prod.js'],
        dest: '<%= config.dist %>/js/env.js'
      }
    },

    /**
     * Minification/obfuscation of JS files.
     * https://github.com/gruntjs/grunt-contrib-uglify
     */
    uglify: {
      dist: {
        files: {
          '<%= config.tmp %>/concat/js/libs.js': ['<%= config.tmp %>/concat/js/libs.js'],
          '<%= config.tmp %>/js/app-build.js': ['<%= config.tmp %>/js/app-build.js']
        }
      }
    },

    /**
     * Revision of assets for cache busting.
     * https://github.com/cbas/grunt-rev
     */
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/js/{,*/}*.js',
            '<%= config.dist %>/css/{,*/}*.css'
          ]
        }
      }
    },

    /**
     * Validate JS files and enforce best practices.
     * https://www.npmjs.org/package/grunt-eslint
     */
    eslint: {
      options: {
        config: 'client/config/eslint.json'
      },
      target: ['client/app/**/*.js', '!client/app/translations.js']
    },

    /**
     * Validate SASS scss files and enforce best practices.
     * https://github.com/ahmednuaman/grunt-scss-lint
     */
    scsslint: {
      allFiles: ['client/sass/**/*.scss'],
      options: {
        config: 'client/config/scsslint.yml'
      }
    },

    /**
     * Replace placeholder with git SHA.
     * https://github.com/yoniholmes/grunt-text-replace
     */
    replace: {
      dev: {
        src: ['<%=config.dist%>/index.html'],
        overwrite: true,                 // overwrite matched source files
        replacements: [{
          from: /@@gitsha@@/g,
          to: '<%= gitinfo.local.branch.current.SHA %>'
        }]
      },
      ifdev: {
        src: ['<%=config.dist%>/index.html'],
        overwrite: true,                 // overwrite matched source files
        replacements: [{
          from: /<!-- if-dev -->(.|\n)*<!-- \/if-dev -->/g,    // thank you http://regex101.com/
          to: ''
        }]
      }
    },

    nggettext_extract: {
      pot: {
        files: {
          'client/po/template.pot': ['client/app/**/*.html']
        }
      },
    },

    nggettext_compile: {
      all: {
        files: {
          'client/app/translations.js': ['client/po/*.po']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);  // loads all grunt tasks using the dependencies list from package.json

  grunt.registerTask('default', [
    'clean',
    'gitinfo',
    'eslint',
    'scsslint',
    'sass',
    'neuter',
    'file_append',
    'useminPrepare',
    'concat',                         // config generated by useminPrepare.
    'cssmin',
    'copy:templates', 'copy:index', 'copy:img', 'copy:data', 'copy:js', 'copy:dist', 'copy:css', 'copy:configDev',
    'usemin',
    'replace:dev',
    'watch'
  ]);

  grunt.registerTask('dist', [
    'clean',
    'gitinfo',
    'eslint',
    'scsslint',
    'sass',
    'neuter',
    'file_append',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'copy:templates', 'copy:index', 'copy:img', 'copy:js', 'copy:dist', 'copy:css', 'copy:configProd',
    'rev',
    'usemin',
    'replace',
    'clean:tmp'
  ]);

};