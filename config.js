/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'https://yy3nw2wo.qcloud.la';
var host ='http://193.112.183.149/';
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        //用户相关的信息:最新的点评
        latestRemark: `${host}/weapp/user/latestRemark`,
        

        //store相关的信息
        storeUrl: `${host}/weapp/store`,

        //点评模板
        remarkTemplate: `${host}/weapp/RemarkTemplate`,
        addRemark: `${host}/weapp/remark/addRemark`,


        //投诉相关
        //---获取默认的投诉模板---//
        tousuTemplate: `${host}/weapp/tousu`,
        //---增加投诉---//
        addTousuNoPict: `${host}/weapp/tousu/AddTousuNoPict`,
        addTousu: `${host}/weapp/tousu/AddTousu`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;