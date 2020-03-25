_TOTAL_STREAMS = 0;

_ME_VIDEO_MUTED = false;
_ME_AUDIO_MUTED = false;

_IS_PRESETENTION_ROOM = false;
_IS_PRESENTENTION_USER = false;
_PRESENTENTION_USER = null;

$(document).ready(function(){

    var roomid = getUrlVars().room;

    _IS_PRESETENTION_ROOM = getUrlVars().presentention_room == "1" ? true : false;
    _IS_PRESENTENTION_USER = getUrlVars().presentention_user == "1" ? true : false;

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

function remountRemoveVideo(size, height = null, adminUserId){

    var width = size - 1;
    var height = height == null ? width : height - 1;

    $('.media-container').each( (index, elem) => {
        var style = "height: 100%; width: 100%;";
        $(elem).attr("style", style);
    } );

    $('.remove_video').each( (index, elem) => {
        var style = "height: " + height + "%; width: " + width + "%;";
        $(elem).attr("style", style);

        if(adminUserId != null && adminUserId != undefined){

            if(elem.id == "remote_stream_"+adminUserId){
                var style = "height: " + height + "%; width: " + width + "%;";
            }else{
                var style = "height: 1px; width: 1px;";
            }

        }else{
            var style = "height: " + height + "%; width: " + width + "%;";
        }

        $(elem).attr("style", style);
        
    } );

    $('.remove_video').each( (index, elem) => {
        if(elem.childNodes.length == 0){
            $(elem).remove();
        }
    } );
    
}

function renderMount(){

    _TOTAL_STREAMS = $('.remove_video').length;

    if(_IS_PRESETENTION_ROOM == true){
        remountRemoveVideo(75, null, _PRESENTENTION_USER);
    }else{

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

}

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var meStream = null;

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = '/';

// comment-out below line if you do not have your own socket.io server
connection.socketURL = angor('aHR0cHM6Ly9ydGNtdWx0aWNvbm5lY3Rpb24uaGVyb2t1YXBwLmNvbTo0NDMv');

connection.socketMessageEvent = 'video-conference';

connection.session = {
    audio: true,
    video: true,
    data: true
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

connection.onmessage = function(event){

    console.log("event");
    console.log("event");
    console.log("event");
    console.log("event");
    console.log("event");
    console.log("event");
    console.log("event");
    console.log(event);

    if(typeof(event.data) == "object"){
        if(event.data.type == "send_user_presentention"){
            _PRESENTENTION_USER = event.data.value;

            renderMount();
        }
    }

}

function sendAdminUserId(adminUserId, toUserId){
    if(_IS_PRESETENTION_ROOM == true && _IS_PRESENTENTION_USER == true){
        connection.send({
            'type': 'send_user_presentention',
            'value': adminUserId
        }, toUserId);
    }
}

connection.onstream = function(event) {
    // var width = parseInt(connection.audiosContainer.clientWidth / 2) - 20;
    var mediaElement = getHTMLMediaElement(event.mediaElement, {
        // title: event.userid,
        buttons: [],
        // width: width,
        showOnMouseEnter: false
    });

    if(event.type=="local"){

        meStream = event;

        var local_video = document.createElement("div");
        $(local_video).attr('class', 'local_video');
        $(local_video).attr('id', 'local_stream_' + event.userid );
        $(local_video).append(mediaElement);

        connection.audiosContainer.appendChild(local_video);

        if(_IS_PRESETENTION_ROOM == true && _IS_PRESENTENTION_USER == true){
            _PRESENTENTION_USER = event.userid;
        }
    }else{

        var remove_video = document.createElement("div");
        $(remove_video).attr('class', 'remove_video');
        $(remove_video).attr('id', 'remote_stream_' + event.userid );
        $(remove_video).append(mediaElement);

        connection.audiosContainer.appendChild(remove_video);

        if(_IS_PRESETENTION_ROOM == true && _IS_PRESENTENTION_USER == true){
    
            sendAdminUserId(_PRESENTENTION_USER, _PRESENTENTION_USER);
        }
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

function controlButtonsRemount(){

    if(_ME_VIDEO_MUTED == true){
        $('#mute_video').addClass('btn_option_selected');
    }
    else{
        $('#mute_video').removeClass('btn_option_selected');
    }

    if(_ME_AUDIO_MUTED == true){
        $('#mute_microphone').addClass('btn_option_selected');
    }
    else{
        $('#mute_microphone').removeClass('btn_option_selected');
    }

}

function muteUnmuteMe(mediaType){

    var stream_id = meStream.stream.id;

    if(mediaType == 'video'){
        if(_ME_VIDEO_MUTED == false){
            _ME_VIDEO_MUTED = true;
            connection.streamEvents[stream_id].stream.mute(mediaType);
        }else{
            _ME_VIDEO_MUTED = false;
            connection.streamEvents[stream_id].stream.unmute(mediaType);
        }
    }

    if(mediaType == 'audio'){
        if(_ME_AUDIO_MUTED == false){
            _ME_AUDIO_MUTED = true;
            connection.streamEvents[stream_id].stream.mute(mediaType);
        }else{
            _ME_AUDIO_MUTED = false;
            connection.streamEvents[stream_id].stream.unmute(mediaType);
        }
    }

    controlButtonsRemount();
}