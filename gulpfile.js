/**
 * Created by Bessic小蟹子 on 2017/7/25.
 * 生产bulid和dist文件夹的内容；
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
//有了“gulp-load-plugins”模块之后，我们其他的gulp模块就可以通过$引用，而不需要变量引用；引用这个模块的时候需要加入一个括号调用
var open = require("open");

//全部变量app用于定于我们的目录路径
var app = {
    srcPath: 'src/',
    devPtah: 'build/',
    prdPath: 'dist/'
};


//拷贝第三方依赖的内容到bulid和dist文件
gulp.task('lib', function () {
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest(app.devPtah + 'vendor'))
        .pipe(gulp.dest(app.prdPath + 'vendor'))
        .pipe($.connect.reload());
});


//拷贝所有的html内容到生产发布目录文件dist和build
gulp.task('html', function () {
    gulp.src(app.srcPath + '**/*.html')
        .pipe(gulp.dest(app.devPtah))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());

});

//拷贝src里面的json文件到dist和bulid
gulp.task('json', function () {
    gulp.src(app.srcPath + 'date/**/*.json')
        .pipe(gulp.dest(app.devPtah))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());

});

gulp.task('less', function () {
    gulp.src(app.srcPath + 'style/index.less')
        .pipe($.less())
        .pipe(gulp.dest(app.devPtah + 'css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'css'))
        .pipe($.connect.reload());

});
gulp.task('js', function () {
    gulp.src(app.srcPath + 'script/**/*.js')
        .pipe($.concat('index.js'))//$.concat用于合并所有的js文件到指定的js文件中
        .pipe(gulp.dest(app.devPtah + 'js'))
        .pipe($.uglify())//$.uglify()用于压缩js文件
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe($.connect.reload());
});

gulp.task('image', function () {
    gulp.src(app.srcPath + 'img/**/*')
        .pipe(gulp.dest(app.devPtah + 'images'))
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'images'))
        .pipe($.connect.reload());
});

//合并以上所有任务，在bulid文件夹和dist夹存在的情况下才有效
//gulp.task('build', ['image', 'js', 'less', 'json', 'lib', 'html']);
gulp.task('build', ['image', 'js', 'less', 'json', 'lib', 'html']);

//每次执行任务，最好先清楚以前的内容
gulp.task('clean', function () {
    gulp.src([app.devPtah, app.prdPath])
        .pipe($.clean())
});

//编写一个服务器.自动刷新浏览器;启动服务器的时候要注意当前端口是否已经被占用了，如果是的话先把terminal的窗口全部先关掉
gulp.task('serve', ['build'], function () {
    $.connect.server({
        root: [app.devPtah],
        livereload: true,
        port: 1234
    });
    open('http://localhost:1234');

    gulp.watch('bower_components/**/*', ['lab']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'date/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/index.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'img/**/*', ['image']);
});

gulp.task('default', ['serve']);
