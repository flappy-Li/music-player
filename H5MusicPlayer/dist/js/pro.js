(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var startTime;
    var lastPer = 0;
    // 渲染每一首歌得总时间
    function renderAllTime(time) {
        lastPer = 0;
        curDuration = time;
        time = formatTime(time);
        $scope.find('.all-time').html(time);
    };
    // 时间转换
    function formatTime(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time - m * 60;
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    };
    // 开始时间
    function start(p) {
        cancelAnimationFrame(frameId);
        lastPer = p == undefined ? lastPer : p;
        startTime = new Date().getTime();
        console.log(lastPer);
        console.log(startTime)
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPer + (curTime - startTime) / (curDuration * 1000);
            if (percent <= 1) {
                update(percent);
            } else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    };
    // 更新左侧时间变化和进度条运动距离
    function update(per) {
        var time = per * curDuration;
        time = formatTime(time);
        $scope.find('.cur-time').html(time);
        var perX = (per - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    };
    // 停止计时
    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000);
        console.log(stopTime);
        console.log(lastPer);
    };
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update:update
    }
})(window.Zepto, window.player || (window.player == {}));