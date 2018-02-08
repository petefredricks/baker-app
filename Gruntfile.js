module.exports = function(grunt) {

	var env = process.env.NODE_ENV;
	var nconf = require('./core/config')(env);
	var path = require('path');
	var pkg = grunt.file.readJSON(__dirname + '/package.json');
	var swfFolder = '/' + pkg.version + '/swf/';
	var async = require('async');
	var assetWorker = require('asset-worker');

	// Project configuration.
	grunt.initConfig({
		pkg: pkg,
		paths: {},

		eslint: {
			target: ['core/client/app/**/*.js', '!core/client/app/lib/**/*.js']
		},

		html2js: {
			options: {
				base: 'core/client/',
				rename: function(name) {
					return '/' + name.replace('.jade', '.html');
				},
				jade: {
					doctype: 'html'
				}
			},
			app: {
				src: ['core/client/app/**/*.jade'],
				dest: 'core/.build/app/lib/angular-templates.js'
			}
		},

		uglify: {
			options: {
				beautify: false
			},
			app: {
				files: {
					'core/.build/app/gen.min.js': [
						'core/client/app/**/*.js',
						'!core/client/app/index.js',
						'!core/client/app/lib/**/*.js'
					],
					'core/.build/app/lib.min.js': [
						'core/client/app/lib/**/*.js',
						'core/.build/app/lib/**/*.js'
					],
					'core/.build/app/index.min.js': [
						'core/client/app/index.js'
					]
				}
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			app : {
				files: {
					'core/.build/app/gen.min.css': [
						'core/.build/app/**/*.css',
						'!core/.build/app/lib/**/*.css'
					],
					'core/.build/app/lib.min.css': [
						'core/.build/app/lib/**/*.css'
					]
				}
			}
		},

		copy: {
			app: {
				files: [
					{
						expand: true,
						cwd: 'core/client/app/lib',
						src: ['fonts/**'],
						dest: 'core/.build/<%= pkg.version %>/'
					},
					{
						expand: true,
						cwd: 'core/client',
						src: ['swf/**'],
						dest: 'core/.build/<%= pkg.version %>/'
					},
					{
						expand: true,
						cwd: 'core/client',
						src: ['**/*.css', 'images/**'],
						dest: 'core/.build/'
					}
				]
			}
		},

		stylus: {
			app: {
				files: [
					{
						expand: true,
						cwd: 'core/client',
						src: ['**/*.styl'],
						dest: 'core/.build',
						ext: '.css'
					}
				]
			}
		},

		concat: {
			js: {
				options: {
					separator: '',
					banner: '"use strict";\n/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					process: function(src) {
						return src.replace(/\/swf\//g, swfFolder);
					}
				},
				src: [
					'core/.build/app/lib.min.js',
					'core/.build/app/index.min.js',
					'core/.build/app/gen.min.js'
				],
				dest: 'core/.build/<%= pkg.version %>/js/app.min.js'
			},
			css: {
				options: {
					banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				src: [
					'core/.build/app/lib.min.css',
					'core/.build/app/gen.min.css'
				],
				dest: 'core/.build/<%= pkg.version %>/css/app.min.css'
			}
		},

		clean: {
			reset: {
				src: ['core/.build']
			},
			build: {
				src: [
					'core/.build/*',
					'!core/.build/<%= pkg.version %>/**',
					'!core/.build/images'
				]
			}
		},

		jade: {
			compile: {
				options: {
					pretty: true,
					data: function(dest,src) {
						var jadeConfig = require('./core/config/jade');
						jadeConfig.paths = grunt.config.get('paths');
						return jadeConfig;
					}
				},
				files: {
					"core/.build/index.html": ["core/views/index.jade"]
				}
			}
		},

		s3: {
			options: {
				accessKeyId: nconf.get('s3:key'),
				secretAccessKey: nconf.get('s3:secret'),
				bucket: nconf.get('s3:bucket'),
				region: nconf.get('s3:region'),
				cacheTTL: Infinity,
				headers: {
					CacheControl: 31536000 // 1 years
				}
			},

			// upload all files within .build/ to root
			build: {
				cwd: "core/.build/",
				src: ["<%= pkg.version %>/**", "images/**"]
			},

			// upload the index file
			indexFile: {
				options: {
					cache: false,
					headers: {
						CacheControl: 0
					}
				},
				cwd: "core/.build/",
				src: "index.html"
			}
		}

	});

	grunt.loadNpmTasks('grunt-aws');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');

	grunt.registerTask('assets', 'Recursively retrieve the paths for all js and css files', function() {

		var done = this.async();

		var tasks = {
			initAssets: function(next) {
				assetWorker.setOptions({
					resourceRoot: nconf.get('app:resourceRoot'),
					optimized: true,
					appVersion: pkg.version
				});
				next();
			},
			getAssetPaths: function(next) {
				assetWorker.getPaths('app', null, function (err, paths) {
					grunt.config.set('paths', paths);
					next();
				});
			}
		};

		async.series(tasks, done);
	});

	grunt.registerTask('build', ['copy', 'html2js', 'stylus', 'cssmin', 'uglify', 'concat', 'clean:build', 'assets', 'jade', 's3']);

	bumpRelease(grunt);
};

// Goosetail version configuration
function bumpRelease(grunt) {

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-git');

	grunt.config('gitfetch', {
		origin: {
			options: {
				repository: 'origin'
			}
		}
	});

	grunt.config('gitpull', {
		master: {
			options: {
				branch: 'master'
			}
		},
		develop: {
			options: {
				branch: 'develop'
			}
		}
	});

	grunt.config('gitpush', {
		master: {
			options: {
				branch: 'master',
				tags: true
			}
		},
		develop: {
			options: {
				branch: 'develop',
				tags: true
			}
		}
	});

	grunt.config('gitcheckout', {
		master: {
			options: {
				branch: 'master'
			}
		},
		develop: {
			options: {
				branch: 'develop'
			}
		}
	});

	grunt.config('gitmerge', {
		master: {
			options: {
				branch: 'master',
				commit: true,
				ffOnly: true,
				message: 'Merge branch \'master\' into develop',
				noff: true
			}
		},
		develop: {
			options: {
				branch: 'develop',
				commit: true,
				ffOnly: true,
				message: 'Merge branch \'develop\' in master',
				noff: true
			}
		}
	});

	grunt.config('bump', {
		options: {
			commitMessage: 'Release %VERSION%',
			tagName: '%VERSION%',
			pushTo: 'origin'
		}
	});

	grunt.registerTask('bump-setup', [
		'gitfetch',
		'gitpull:master',
		'gitpull:develop',
		'gitcheckout:master',
		'gitmerge:develop'
	]);

	grunt.registerTask('bump-cleanup', [
		'gitcheckout:develop',
		'gitmerge:master',
		'gitpush:master',
		'gitpush:develop'
	]);

	grunt.registerTask('release-patch', ['bump-setup', 'bump:patch', 'bump-cleanup']);
	grunt.registerTask('release-minor', ['bump-setup', 'bump:minor', 'bump-cleanup']);
	grunt.registerTask('release-major', ['bump-setup', 'bump:major', 'bump-cleanup']);

}