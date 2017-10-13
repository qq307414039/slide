/**
 * Created by GaoWei on 2017/10/12.
 */
/*使用方式
 slide.move({
 imgWrap: '.img-wrap',//图片父元素
 dotWrap: '.dot-wrap',//切换按钮父元素
 activeClass: 'active',//切换按钮选中样式
 intervalTime: 6000,//计时间隔
 animateTime: 1000//动效时长
 });*/

var slide = {
    move: function (arg) {
        var imgWrap = $(this.matchingSelector(arg.imgWrap)),
            dotWrap = $(this.matchingSelector(arg.dotWrap)),
            imgWrapImg = imgWrap.find('img'),
            dotWrapLi = dotWrap.children(),
            theFirstImg = imgWrapImg.eq(0),
            theLastImg = imgWrapImg.eq(imgWrapImg.length - 1),
            w = $(window).width();

        imgWrap.append('<li><img src="' + theFirstImg.attr('src') + '"></li>');
        imgWrap.prepend('<li><img src="' + theLastImg.attr('src') + '"></li>');

        var imgWrapLi = imgWrap.find('li');
        var length = imgWrapLi.length;
        imgWrap.width(length * w);
        imgWrapLi.width(w);

        var startX = 0,
            startY = 0,
            canMove = true,
            onTouchElement = $(this.matchingSelector(arg.imgWrap))[0];

        onTouchElement.ontouchstart = function (e) {
            clearInterval(timer);
            timer = null;
            var touch = e.touches[0]; //获取第一个触点
            var x = Number(touch.pageX); //页面触点X坐标
            var y = Number(touch.pageY); //页面触点Y坐标
            //记录触点初始位置
            startX = x;
            startY = y;
        };

        onTouchElement.ontouchmove = function (e) {
            //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
            var touch = e.touches[0]; //获取第一个触点
            var x = Number(touch.pageX); //页面触点X坐标
            var y = Number(touch.pageY); //页面触点Y坐标
            //判断滑动方向
            if (x - startX != 0) {//左右滑动
                if (x - startX > 0) {//向右滑动
                    //canMove && console.log('TouchMove事件触发：（向右滑动:' + x + ', ' + startX + '）');
                    canMove && moveAnimate(imgWrap, 'right');

                } else if (x - startX < 0) {//向左滑动
                    //canMove && console.log('TouchMove事件触发：（向左滑动:' + x + ', ' + startX + '）');
                    canMove && moveAnimate(imgWrap, 'left');
                }
                canMove = false;
            }
            if (y - startY != 0) {  //上下滑动

            }
        };

        var timer = setInterval(function () {
            moveAnimate(imgWrap, 'left');
        }, arg.intervalTime);

        function moveAnimate(_this, direction) {//图片组动效移动控制函数
            var left = parseInt(_this.css('left'));
            if (direction == 'right') {
                left += w;
            } else if (direction == 'left') {
                left -= w;
            }
            _this.stop().animate({'left': left + 'px'}, arg.animateTime, function () {
                imgWrapPositionToggle(left);
                canMove = true;
                if (!timer) {
                    timer = setInterval(function () {
                        moveAnimate(imgWrap, 'left');
                    }, arg.intervalTime);
                }

            })
        }

        function imgWrapPositionToggle(left) {//图片列表组位置切换函数
            if (left >= 0) {
                imgWrap.css('left', -w * (length - 2));
            } else if (left <= -w * (length - 1)) {
                imgWrap.css('left', -w + 'px');
            }
            computeCurPic(left);
        }

        function computeCurPic(left) {//计算当前第几张图函数
            var num = Math.abs(left / w);
            if (num == length - 1 || num == 1) {
                num = 1;
            } else if (num == 0 || num == length - 2) {
                num = length - 2;
            }
            dotWrapLi.eq(num - 1).addClass(arg.activeClass).siblings().removeClass(arg.activeClass);
        }

    },
    matchingSelector: function (selector) {
        selector = $.trim(selector);
        if (selector.slice(0, 1) == '.' || selector.slice(0, 1) == '#') {
            selector = selector;
        } else if ($('#' + selector).length > 0) {
            selector = '#' + selector;
        } else if ($('.' + selector).length > 0) {
            selector = '.' + selector;
        }
        return selector;
    }
};