_TOTAL_STREAMS = 0;

$(document).ready(function(){

    var roomid = getUrlVars("room").room;

    if(roomid == null || roomid == undefined || roomid == ''){
        roomid = _ROOM_ID
    }
    
    connection.openOrJoin(roomid, function(isRoomExist, roomid) {
        if (!isRoomExist) {
            showRoomURL(roomid);
        }
    });

});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function remountRemoveVideo(size, height = null){

    var width = size - 1;
    var height = height == null ? width : height - 1;

    $('.media-container').each( (index, elem) => {
        var style = "height: 100%; width: 100%;";
        $(elem).attr("style", style);
    } );

    $('.remove_video').each( (index, elem) => {
        var style = "height: " + height + "%; width: " + width + "%;";
        $(elem).attr("style", style);
    } );

    $('.remove_video').each( (index, elem) => {
        if(elem.childNodes.length == 0){
            $(elem).remove();
        }
    } );

    // $('.local_video').attr("style", "height: 100%; width: 100%");
}

function renderMount(){

    _TOTAL_STREAMS = $('.remove_video').length;

    if(_TOTAL_STREAMS == 1){
        remountRemoveVideo(100);
    }

    else if(_TOTAL_STREAMS == 2){
        remountRemoveVideo(50, 100);
    }

    else if(_TOTAL_STREAMS >= 3 && _TOTAL_STREAMS <= 4){
        remountRemoveVideo(50);
    }

    else if(_TOTAL_STREAMS >= 5 && _TOTAL_STREAMS <= 6){
        remountRemoveVideo(33, 50);
    }

    else if(_TOTAL_STREAMS >= 7 && _TOTAL_STREAMS <= 8){
        remountRemoveVideo(25, 50);
    }

    else if(_TOTAL_STREAMS >= 9 && _TOTAL_STREAMS <= 10){
        remountRemoveVideo(20, 50);
    }

    else{
        remountRemoveVideo(20);
    }

}

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = '/';

// comment-out below line if you do not have your own socket.io server
connection.socketURL = angor('aHR0cHM6Ly9ydGNtdWx0aWNvbm5lY3Rpb24uaGVyb2t1YXBwLmNvbTo0NDMv');

connection.socketMessageEvent = 'video-conference';

connection.session = {
    audio: true,
    video: true
};

var bitrates = 512;
var resolutions = 'Ultra-HD';
var videoConstraints = {};

if (resolutions == 'HD') {
    videoConstraints = {
        width: {
            ideal: 1280
        },
        height: {
            ideal: 720
        },
        frameRate: 30
    };
}

if (resolutions == 'Ultra-HD') {
    videoConstraints = {
        width: {
            ideal: 1920
        },
        height: {
            ideal: 1080
        },
        frameRate: 30
    };
}

connection.mediaConstraints = {
    video: videoConstraints,
    audio: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
};

// https://www.rtcmulticonnection.org/docs/iceServers/
// use your own TURN-server here!
connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}];

connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function(event) {
    // var width = parseInt(connection.audiosContainer.clientWidth / 2) - 20;
    var mediaElement = getHTMLMediaElement(event.mediaElement, {
        // title: event.userid,
        buttons: ['mute'],
        // width: width,
        showOnMouseEnter: false
    });

    if(event.type=="local"){
        var local_video = document.createElement("div");
        $(local_video).attr('class', 'local_video');
        $(local_video).append(mediaElement);

        connection.audiosContainer.appendChild(local_video);
    }else{
        var remove_video = document.createElement("div");
        $(remove_video).attr('class', 'remove_video');
        $(remove_video).append(mediaElement);

        connection.audiosContainer.appendChild(remove_video);
    }

    renderMount();

    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;
};

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }

    remountRemoveVideo();
};

function angor (s)
{
    var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
    var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

    for (z in n)
    {
        for (i = n[z][0]; i < n[z][1]; i++)
        {
            v.push(w(i));
        }
    }
    for (i = 0; i < 64; i++)
    {
        e[v[i]] = i;
    }

    for (i = 0; i < s.length; i+=72)
    {
        var b = 0, c, x, l = 0, o = s.substring(i, i+72);
        for (x = 0; x < o.length; x++)
        {
            c = e[o.charAt(x)];
            b = (b << 6) + c;
            l += 6;
            while (l >= 8)
            {
                r += w((b >>> (l -= 8)) % 256);
            }
         }
    }
    return r;
}