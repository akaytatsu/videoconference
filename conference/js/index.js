var crypto = window.crypto || window.msCrypto;

function randomValueHex (len) {
    var array = new Uint32Array(1);

    return window.crypto.getRandomValues(array);
}

function getRoomId(){
    return randomValueHex(4)+"-"+randomValueHex(4)+"-"+randomValueHex(4);
}

function genLink(){

    var code = getRoomId();
    var link_meet = "https://www.videomeet.com.br/conf.html?room="+code;

    var link_tag = "<a href=\"" + link_meet + "\">" + link_meet + "</a>";

    $("#link_meet").html(link_tag);

    $(".box_link").css("display", "inline");
}