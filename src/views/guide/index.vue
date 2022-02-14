<template>
    <div class="box">
        <div class="content">
            <div style="width: 1200px;text-align: center;">
                <h1>为你提供</h1>
            </div>
            <div class="box-content flex flex-justify-content-between">
                <div style="width: 400px">
                    <h1>发布音乐及管理</h1>
                    <p>用户可以自由的查看并管理自己上传的音乐，为你的音乐创作更高价值</p>
                    <a href="">查看详情</a>
                </div>
                <img src="@/assets/images/releaseBag.png" alt="">
            </div>
            <div class="box-content flex flex-justify-content-between">
                <img src="@/assets/images/forgingBag.png" alt="">
                <div style="width: 400px">
                    <h1>铸造nft</h1>
                    <p>将您上传的每个作品进行链上存证，永久不可篡改，为后续音乐作品价值交易提供可信信息</p>
                    <a href="">查看详情</a>
                </div>
            </div>
            <div class="box-content flex flex-justify-content-between">
                <div style="width: 400px">
                    <h1>NFT管理</h1>
                    <p>修改已创建的nft作品信息、设置拥有的nft作品进行二次交易，选择上架或下架协助你管理已创建以及拥有的nft音乐作品</p>
                    <a href="">查看详情</a>
                </div>
                <img src="@/assets/images/manageBag.png" alt="">
            </div>
            <div class="box-content flex flex-justify-content-between">
                <img src="@/assets/images/homePageBag.png" alt="">
                <div style="width: 400px">
                    <h1>个人主页</h1>
                    <p>已创建nft和够买拥有的nft作品可以公开展示,让用户更好的了解你</p>
                    <a href="">查看详情</a>
                </div>
            </div>
            <div class="box-content flex flex-justify-content-between">
                <div style="width: 400px">
                    <h1>互动管理</h1>
                    <p>查看作品点赞,查看作品评论,添加关注,删除好友,私信,快速管理关注及粉丝列表</p>
                    <a href="">查看详情</a>
                </div>
                <img src="@/assets/images/interactionBag.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.box{
    background-color: #F7F8FA;
    .content{
        width: 1200px;
        height: 2381px;
        margin: 0 auto;
        background-color: #FFFFFF;
        padding: 60px 73px 0 70px;
        box-sizing: border-box;
        .h1{
            width: 1200px;
            font-size: 42px;
            color: #333333;
        }
        .box-content{
            width: 100%;
            height: 330px;
            margin-top: 99px;
            h1{
                font-size: 26px;
            }
            p{
                font-size: 16px;
                color: #999999;
                margin-top: 25px;
            }
            a{
                font-size: 14px;
                color: #FF2C2C;
                display: block;
                margin-top: 20px;
            }
            img{
                width: 500px;
                height: 326px;
            }
        }
    }
}
</style>