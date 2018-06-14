/**
 * 给路由使用的公共方法
 * */
let commentQuery = require('../query/commentQuery');
let articleQuery = require('../query/articleQuery');
let zanQuery = require('../query/zanQuery');
let channelQuery = require('../query/channelQuery');
let queryParse = require("../cache/util/queryParse")

//获取blogList

async function getBlogList(params, currentPage, pageSize) {
    var query = {};
    if (params && params.title) {
        query['title'] = new RegExp(params.title);
    }
    if (params && params.tag) {
        query['tag'] = params.tag;
    }
    //排行榜排序字段
    let sort = {};
    if (params && params.search_field) {
        sort[params.search_field] = -1;
    }
    let info = await  articleQuery.articleListPromise(currentPage, query, sort, pageSize);
    //普通模式下 不需要在排序评论信息的 直接返回以节省性能
    if (params.search_field == null || (params.search_field != "cv" && params.search_field != "zan")) {
        for (let module of info.models) {
            let count = await commentQuery.getCommentCount(module.uuid);
            let zanCount = await  zanQuery.getZanCountByBlogId(module.uuid);
            let channel = await channelQuery.getChannelByUUIDPromise(module.tag);
            module['commentSize'] = count;
            module['zanSize'] = zanCount;
            module['channelName'] = channel.name;
        }
        return info;
    } else {
        //按评论量排序
        let allModules = await articleQuery.articleListAllPromise(query, sort);
        let info = {};
        info.models = allModules;
        for (let module of info.models) {
            let count = await commentQuery.getCommentCount(module.uuid);
            let zanCount = await  zanQuery.getZanCountByBlogId(module.uuid);
            let channel = await channelQuery.getChannelByUUIDPromise(module.tag);
            module['commentSize'] = count;
            module['zanSize'] = zanCount;
            module['channelName'] = channel.name;
        }
        if (params.search_field == "cv") {
            //按评论量排序
            info.models.sort((a, b) => {
                return b.commentSize - a.commentSize;
            })
        } else {
            //按点赞量排序
            info.models.sort((a, b) => {
                return b.zanSize - a.zanSize;
            })
        }
        //内存分页
        info = queryParse.getPageQuery(currentPage, info.models);
        return info;
    }
}


//查询单个
async function getSingle(uuid) {
    let blog = await articleQuery.getArticleByUUIDPromise(uuid);
    let channel = await channelQuery.getChannelByUUIDPromise(blog.tag);
    //增加pv
    let pv = blog.pv == null ? 0 : blog.pv;
    blog.pv = parseInt(pv) + 1;
    console.log(JSON.stringify(blog))
    await articleQuery.savePromise(uuid, blog);
    blog["channelName"] = channel.name;
    var json = {
        module: blog
    }
    return json;
}

//合并对象
async function mergeData(data) {
    let query = {
        rank: 1
    }
    //获取顶级栏目
    let topChannels = await channelQuery.pagePromise(1, query, {}, 100);
    let allChannels = await channelQuery.getChannelALLPromise();
    //获取最近文章
    let recentList = await getBlogList({search_field: "pv"},1, 5);
    //获取最热文章
    let hotList = await getBlogList({search_field: "cv"},1, 5);
    //推荐文章
    let recommendList = await getBlogList({search_field: "zan"},1, 5);
    topChannels = topChannels.models;
    recentList = recentList.models;
    hotList = hotList.models;
    recommendList = recommendList.models;
    // allChannels = allChannels;
    // console.log().log(allChannels);

    return Object.assign({}, {topChannels,recentList,hotList,recommendList,allChannels}, data)
}

module.exports = {getBlogList, mergeData,getSingle};


