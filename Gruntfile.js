// Generated on 2014-03-03 using generator-webapp 0.2.7
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'dist',
		build: 'build'
	};

	var pkg = grunt.file.readJSON('package.json');
	var ext = '.js';

	grunt.initConfig({
		yeoman: yeomanConfig,

		pkg: pkg,

		watch: {
			styles: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
				tasks: ['copy:styles']
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= yeoman.app %>/*.html',
					'.tmp/styles/{,*/}*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'test')
						];
					}
				}
			},
			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, yeomanConfig.dist)
						];
					}
				}
			}
		},

		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			build: {
				src: ['.tmp', '<%= yeoman.build %>/*', '!<%= yeoman.build %>/.git*']
			},
			oldversion: '<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.js',
			server: '.tmp'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			single: {
				src: ['<%= yeoman.app %>/scripts/<%= pkg.name %>.js']
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,*/}*.js',
				'!<%= yeoman.app %>/scripts/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},

		mocha: {
			all: {
        src: ['test/index.html']
      },
				options: {
					run: true,
					log: true,
					reporter: 'Spec'
				}
		},

		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%= yeoman.app %>/images',
				javascriptsDir: '<%= yeoman.app %>/scripts',
				fontsDir: '<%= yeoman.app %>/styles/fonts',
				importPath: '<%= yeoman.app %>/bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false
			},
			dist: {
				options: {
					generatedImagesDir: '<%= yeoman.dist %>/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
						'<%= yeoman.dist %>/styles/fonts/*'
					]
				}
			}
		},

		useminPrepare: {
			options: {
				dest: '<%= yeoman.dist %>'
			},
			html: '<%= yeoman.app %>/index.html'
		},

		usemin: {
			options: {
				dirs: ['<%= yeoman.dist %>']
			},
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},

		uglify: {
			single: {
				options: {
					mangle: true,
					compress: true,
					sourceMap: true,
					sourceMapName: '<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.map'
				},
				files: {
					'<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.js']
				}
			}
		},
		cssmin: {
			// This task is pre-configured if you do not wish to use Usemin
			// blocks for your CSS. By default, the Usemin block from your
			// `index.html` will take care of minification, e.g.
			//
			//     <!-- build:css({.tmp,app}) styles/main.css -->
			//
			// dist: {
			//     files: {
			//         '<%= yeoman.dist %>/styles/main.css': [
			//             '.tmp/styles/{,*/}*.css',
			//             '<%= yeoman.app %>/styles/{,*/}*.css'
			//         ]
			//     }
			// }
		},
		htmlmin: {
			dist: {
				options: {
					/*removeCommentsFromCDATA: true,
					// https://github.com/yeoman/grunt-usemin/issues/44
					//collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true*/
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: '*.html',
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		concat: {
			options: {
	      separator: ';',
	    },
	    dist: {
	      src: ['<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.min.js', '<%= yeoman.build %>/multiLang.json', '<%= yeoman.build %>/uk-bank-holidays.json'],
	      dest: '<%= yeoman.build %>/merged-<%= pkg.version %>.js',
	    },
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'images/{,*/}*.{webp,gif}',
						'styles/fonts/*'
					]
				}]
			},
			single: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.build %>',
					dest: '<%= yeoman.dist %>'
				}]
			},
			tobuild: {
				files: [{
					dest: '<%= yeoman.build %>/<%= pkg.name %>-<%= pkg.version %>.js',
					src: '<%= yeoman.app %>/scripts/datepicker.js'
				},{
					src: '<%= yeoman.app %>/scripts/multiLang.json',
					dest: '<%= yeoman.build %>/multiLang.json'
				},{
					src: '<%= yeoman.app %>/scripts/uk-bank-holidays.json',
					dest: '<%= yeoman.build %>/uk-bank-holidays.json'
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		'json-minify': {
		  build: {
		    files: 'build/*.json'
		  }
		},

		concurrent: {
			server: [
				'compass',
				//'coffee:dist',
				'copy:styles'
			],
			test: [
				//'coffee',
				'copy:styles'
			],
			dist: [
				'compass',
				'copy:styles',
				'imagemin',
				'htmlmin'
			]
		}

	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}
		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'open',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		//'clean:server',
		//'concurrent:test',
		//'connect:test',
		'mocha'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'cssmin',
		'uglify',
		'copy:dist',
		'rev',
		'usemin'
	]);

	// Default task(s).
	grunt.registerTask('jsbuild', [
	'clean:build',
	'copy:tobuild',
	'jshint:single',
	'uglify:single',
	'json-minify',
	'clean:oldversion',
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);

};
