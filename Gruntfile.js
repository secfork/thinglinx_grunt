// Generated on 2015-07-28 using generator-angular 0.12.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
 

module.exports = function(grunt) {


    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn'
    });

    grunt.loadNpmTasks('grunt-connect-proxy');

   grunt.loadNpmTasks('grunt-ssh-deploy');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'public',
        thing: "thing/", // app.js , app.css 目录;
    };


    // Define the configuration for all the tasks

    var  replace_js_test_nginx_console  = [
       // 用于显示图片;
        { match:"oss", replacement: "http://thinglinx-test.oss-cn-beijing.aliyuncs.com/"},
         
    ];

    var  replace_js_build = [
        // 用于显示图片;
        { match:"oss" , replacement: "http://thinglinx-net.oss-cn-beijing.aliyuncs.com/"}

    ];

    grunt.initConfig({

        // Project settings
        yeoman: appConfig,



        replace: {

          js_build: {
                options: {
                  patterns: replace_js_build
                },
                files: [
                    {expand: true, flatten: true,
                    src: ['.tmp/concat/thing/app.js'], dest: '.tmp/concat/thing/'}
                ]
          } ,

          js_for_test_nginx_console: {
                options:{
                    patterns: replace_js_test_nginx_console
                },
                files: [
                    {expand: true, flatten: true,
                    src: ['.tmp/concat/thing/app.js'], dest: '.tmp/concat/thing/'}
                ]
          }
 
        },


        preprocess: {
            options: {
                context: {
                    append: false, // 是否build  debug信息;
                    region_online: false, // 是否build  region 是否在线信息;
                    debug: false ,
                    testbuild: false  , // 是否为 test_nging_console 服务器 构建项目;



                }
            },
 

            html: {
                expand: true,
                cwd: 'app',
                src: "athena/{*/,}*.html",
                dest: '.tmp/html'

                //[
                //  {**/,}*.html
                // '*.html',
                // "account/*.html",
                // "dastation/*.html",
                //  "debris/*.html",
                //  "device/*html",
                //  "point/*html",
                //  "region/*html",
                //  "show/*html",
                //  "support/*html",
                //  "sysmodel/*html",
                //  "template/*html",
                //  "user/*html"

                // ]

            },


            js: {
                src: '.tmp/concat/<%= yeoman.thing %>app.js',
                dest: '.tmp/concat/<%= yeoman.thing %>app.js'
            } ,

        },

        uncss: {
            dist: {
                files: {
                    // 'dist/styles/main.css':  "athena/{*/,}*.html"

                    // 'dist/styles/main_i.css': [ "app/index.html" , ".tmp/html/athena/{*/,}*.html" ]

                    // 'dist/styles/main_1.css': [ "app/index.html" , "app/athena/account/*.html" ],
                    // 'dist/styles/main_2.css': [ "app/index.html" , "app/athena/dastation/*.html" ],
                    // 'dist/styles/main_3.css': [ "app/index.html" , "app/athena/debris/*.html" ],
                    // 'dist/styles/main_6.css': [ "app/index.html" , "app/athena/region/*.html" ],
                    // 'dist/styles/main_7.css': [ "app/index.html" , "app/athena/show/*.html" ],
                    // 'dist/styles/main_7.css': [ "app/index.html" , "app/athena/support/*.html" ],
                    // 'dist/styles/main_8.css': [ "app/index.html" , "app/athena/sysmodel/*.html" ],

                    // 'dist/styles/main_9.css': [ "app/index.html" , "app/athena/template/*.html" ],
                    // 'dist/styles/main_10.css': [ "app/index.html" , "app/athena/user/*.html" ],

                    // 'dist/styles/main_11.css': [ "app/index.html" , "app/athena/_device/*.html" ],
                    // 'dist/styles/main_12.css': [ "app/index.html" , "app/athena/_dtu/*.html" ],
                    // 'dist/styles/main_13.css': [ "app/index.html" , "app/athena/_point/*.html" ]

                }
            }
        },

        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },
         // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {


            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                //tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,**/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {

            options: {
                port: 9000,
                // Change 'hostname' to '0.0.0.0' to access  the server from outside.

                // hostname: "localhost",
                hostname: 'nzp9uf7kusus3nuxe3',
                // hostname: '0.0.0.0',
                livereload: 35729   // 默认是 35729 ， 但是 nodeconsole 战中了；
            }, 
            server: {    
                options: {
                    protocol:"https",
                    port:8443,
                    key: grunt.file.read('server.key').toString(),
                    cert: grunt.file.read('server.crt').toString(),
                    ca: grunt.file.read('ca.crt').toString()
                }

            },
            
            proxies:[
                {
                    context:"/node", 
                    host:"127.0.0.1",   // local ; 
                    // host:'test.thinglinx.net' , // test_console ;  
                    port:"8080",
                    https: false,
                    changeOrigin: true
                }
            ],

            livereload: {
                options: { 
                    open: true,
                    // open: 'http://myapp.dev:9000',
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],

                    middleware: function (connect, options) {

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
 
                        // Setup the proxy 
                        var middlewares = [ require('grunt-connect-proxy/lib/utils').proxyRequest ];
 
                        // Serve static files. 
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });
 
                        // Make directory browse-able. 
                        var directory = options.directory || options.base[options.base.length - 1];
                        
                        middlewares.push(connect.directory(directory));
 
                        return middlewares;
                    } 
                }
            },


            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            

            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }

        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },


        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/<%= yeoman.thing %>{,*/}*.js',
                    '<%= yeoman.dist %>/<%= yeoman.thing %>{,*/}*.css',
                    //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    // '<%= yeoman.dist %>/styles/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        uglify:{ 
            options:{
                compress: {
                    drop_console: false // true ;
                }, 
                sourceMap:  true ,//true ,
                sourceMapIncludeSources:  true //true
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= yeoman.dist %>',
                    '<%= yeoman.dist %>/images',
                    '<%= yeoman.dist %>/styles'
                ],
                patterns: {
                    js: [
                        [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
                    ]
                }
            }
        },



        htmlmin: {
            dist: {
                options: {
                    //collapseWhitespace: true,
                    // conservativeCollapse: true,
                    // collapseBooleanAttributes: true,
                    // removeCommentsFromCDATA: true
                    collapseBooleanAttributes: true,
                    
                    collapseWhitespace: true, // 删除空格 ; 

                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'athena/{,**/}*.html'],
                    // src: [  'athena/dastation/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        ngtemplates: {
            dist: {
                options: {
                    dot: false,

                    module: 'thinglinx',
                    htmlmin: '<%= htmlmin.dist.options %>',
                    usemin: 'thing/app.js' ,
                },
                // cwd: '<%= yeoman.app %>',

                cwd: ".tmp/html",
                src: "{**/,}*.html",
                // src: [
                //     "athena/*.html",
                //    'athena/_device/{**/,}*.html',
                //    'athena/_dtu/{**/,}*.html',
                //     'athena/_point/{**/,}*.html',
                //     'athena/account/{**/,}*.html',
                //     'athena/dastation/{**/,}*.html',
                //     'athena/debris/{**/,}*.html',
                //     'athena/region/{**/,}*.html',
                //     'athena/show/{**/,}*.html',
                //     'athena/support/{**/,}*.html',

                //     'athena/sysmodel/{**/,*}.html',


                //     'athena/template/{**/,}*.html',
                //     'athena/user/{**/,}*.html',
                //     ],


                dest: '.tmp/templateCache.js'
            }
        },



        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/thing',
                    src: '*.js',
                    dest: '.tmp/concat/thing'
                }]
            }
        },



        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                        expand: true,
                        dot: false, //  是否包含与点 开头的文件  ( .svn )
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt,pdf}',
                           // '.htaccess',  // 分布式配置文件;  从哪里生成的??
                            '*.html',
                            'images/{,*/}*.{webp}',
                            //'styles/{,*/}*.*',
                            '404/**',

                            // athena 下的文件做成 tempalteCache ;   {athena,fonts,img}
                             '{fonts,img,l10n}/**',
                            'lib/*/**' //  jquery 插件拷贝;

                        ]
                    }, {  

                        // expand:true,
                        // cwd:".tmp/html",
                        // src:"athena/**",
                        // dest:"dist" 
                        
                    }
                    // {
                    //   expand: true,
                    //   cwd: '.tmp/images',
                    //   dest: '<%= yeoman.dist %>/images',
                    //   src: ['generated/*']
                    // }

                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                //'imagemin',
                //'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        } ,

        environments: {
            options: {
              local_path: 'dist',
            },

            production: {
              options: {
                host: '123.56.148.195',
                username: 'root',
                password: 'Fuck13gfw14forever',
                deploy_path: '/root',
                // before_deploy: 'cd /sites/great_project/releases/current && forever stopall',
                // after_deploy: 'cd /sites/great_project/releases/current && npm install && forever start app.js'
              }
            }
        } ,

        'ftp-deploy': {
            build: {
                auth: {
                  host: '123.56.148.195',
                  port: 22,
                  authKey: 'key1'
                },
                src: 'dist/thing',
                dest: '/root/xxx'
                //exclusions: ['path/to/source/folder/**/.DS_Store', 'path/to/source/folder/**/Thumbs.db', 'path/to/dist/tmp']
            }
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
             'wiredep',
            'concurrent:server',

            'autoprefixer:server',

            "configureProxies",

            'connect:livereload', 
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'wiredep',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', function( arg ){

        var  tasks = [ 'clean:dist',
            'wiredep',
            'useminPrepare',
            'concurrent:dist',
            
            "preprocess:html" ,

            'ngtemplates',   // $templaceCache 不好使了 , 故拷贝  copy:dist 时 加上了拷贝 .tem/html/ahten 文件夹; 

            'copy:dist', // 拷贝  thinglinx_boot.js 到 .tmp/boot 目录 ;

            'concat',
            'ngAnnotate',
            "preprocess:js"

            ];

        if( arg == "test"){
             tasks.push("replace:js_for_test_nginx_console");
        }else{
            tasks.push("replace:js_build");
        }

        tasks = tasks.concat([
                'cssmin',
                'uglify',

                'filerev',
                 'usemin', 
                 'htmlmin',
            ])

        console.log( tasks );
       grunt.task.run( tasks );



    });


   grunt.registerTask('default', ['babel']);

};
