var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
var audio = new root.audioManager();
function bindClick() {
    $scope.on("play:change", function (event, index, flag) {
        audio.setAudioSource(songList[index].audio);
        if (audio.status == "play" || flag) {
            audio.play();
            // root.pro.start();
        }
        root.pro.renderAllTime(songList[index].duration);
        root.render(songList[index]);
    })
    //移动端click有300ms延迟
    $scope.on("click", ".prev-btn", function () {
        var index = controlmanager.prev();
        $scope.trigger("play:change", index);
        if(audio.status == "play"){
            root.pro.start(0);        
        }else{
            root.pro.update(0);
        }
    })
    $scope.on("click", ".next-btn", function () {
        var index = controlmanager.next();
        $scope.trigger("play:change", index);
        if(audio.status == "play"){
            root.pro.start(0);        
        }else{
            root.pro.update(0);
        }
    })
    $scope.on("click", ".play-btn", function () {
        if (audio.status == "play") {
            audio.pause();
            root.pro.stop();
        } else {
            audio.play();
            root.pro.start();
        }
        $(this).toggleClass("playing");
    })
    $scope.on("click", ".list-btn", function () {
        root.playList.show(controlmanager);
    })
};
function bindTouch(){
    var $slider = $scope.find('.slider-point');
    var offset = $scope.find('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;
    $slider.on('touchstart',function(){
        root.pro.stop();
    }).on('touchmove',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left)/width;
        if(per > 0 && per < 1){
            root.pro.update(per);
        }
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left)/width;
        if(per > 0 && per < 1){
            var cutTime = per * songList[controlmanager.index].duration;
            $scope.find('.play-btn').addClass('playing');
            audio.playTo(cutTime);
            audio.status = 'play';
            root.pro.start(per);        
        }
    });
};

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change", 0);

        },
        error: function () {
            console.log("error")
        }
    })
}

getData("../mock/data.json")