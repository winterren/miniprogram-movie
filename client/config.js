/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://izyphovw.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,
        user: `${host}/weapp/user`,

        // 获得电影
        getMovie: `${host}/weapp/movie`,
        // 电影详情
        getMovieDetail: `${host}/weapp/movie/`,
        // 获得评论
        getComment: `${host}/weapp/comment/`,
        getCommentDetail: `${host}/weapp/commentdetail/`,
        getRandomComment: `${host}/weapp/randomcomment`,
        // 写评论
        addComment: `${host}/weapp/addcomment`,
        //获得收藏
        getFavourite: `${host}/weapp/favourite/`,
        checkFavourite: `${host}/weapp/checkfavourite/`,
        addFavourite: `${host}/weapp/addfavourite/`,
        delFavourite: `${host}/weapp/delfavourite/`,
    }
};

module.exports = config;
