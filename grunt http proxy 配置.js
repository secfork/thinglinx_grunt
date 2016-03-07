var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;


这断代码要加在gruntfile.js顶部， module.exports上边。



然后， 再connect中添加proxy配置及livereload配置

 connect: {
     options: {
         port: 9000,
         open: true,
         livereload: 35729, 
         // Change this to '0.0.0.0' to access the server from outside 
         hostname: 'localhost'
     },
     proxies: [{
         context: '/website',
         host: 'www.somesite.com',
         port: 80,
         https: false,
         changeOrigin: true
     }],

     livereload: {
         options: {
             middleware: function(connect) {
                 return [   lrSnippet,
						    mountFolder(connect, '.tmp'),
						    connect().use('/bower_components',
						        connect.static('./bower_components')),
						    mountFolder(connect, config.app),
						    proxySnippet,
						];

             }
         }
     },
      
 }


接下来， 再serve这个task里添加proxy

grunt.task.run([
    'clean:server',
    'wiredep',
    'concurrent:server',
    'autoprefixer',

    // configureProxies 增加到livereload前边      
    'configureProxies',
    'connect:livereload',
    'watch'
]);




var a = {}

var i = 0 ;
while( i++ < 100000 ){
    a["user_id_" + i] = { user_id:"u_id"+i ,  username: "name_" + i }

}
