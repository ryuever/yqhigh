window.user_friends = [];
window.user_group = {};
window.username = '';
var socket = io();
var notify_msg = {};
$(document).ready(function(){
    $(".wp_top_tabs .notify").click(function(){
        var notify_html = "";
        if (Object.keys(notify_msg).length > 0){
            notify_html = '<ul>';
            for (var key in notify_msg){
                $.each(notify_msg[key], function(index, value){
                    $("#"+key+"-msg").append($('<p>').text(value));
                });
                notify_html = notify_html + '<li>' +
                    '<a href=javascript:register_popup("'+ key +'"' + ',"' + key + '")>message </a>'
                    + 'from ' + key + '</li>';
            }
            notify_html = notify_html + '</ul>';
        }else{
            notify_html = "<p> no notification messages </p>";
        }
        
        $("#notification-count").hide("slow");        
        $("#chat-container").show();
        $("#chat-container").html(notify_html);
        $("#chat-container").show();
    });
    
    $("#webpager .friends").click(function(){
        var params = {
            user_name : $('#nav-tools-user-link').text()
        };
        
        $.ajax({
            data: params,
            url : "/buddy/"+params.user_name,            
            dataType: 'json',
            cache: false,           
            type:'get',
            timeout: 5000,
            success: function(data){
        //- div(id="buddy-collection")
        //- div(id="buddy" style="height: 590px;")
        //-     div(class="wp_collector_box" style="height: 500px;")
        //-         #friends.wp_collector.friends
        //-             div(class="collector_title friends" data-type="friends")
        //-                 span.text 全部好友
        //-                 span.num 20
        //-         #group.wp_collector.groups

                var buddy_layout = '<div id="buddy-collection"></div><div id="buddy" style="height: 590px;"><div style="height: 500px;" class="wp_collector_box"><div id="friends" class="wp_collector friends"><div data-type="friends" class="collector_title friends"><span class="text">全部好友</span><span class="num">20</span></div></div><div id="group" class="wp_collector groups"></div></div></div>';
                
                $('#chat-container').html(buddy_layout);
                
                var s=document.getElementById('buddy-collection');
                $('#buddy-collection').html('');                
                var li_item;
                var a_item;
                var online_item;                
                var ul_item = document.createElement("ul");
                window.username = data.record.name;
                window.user_friends = data.record.friends;
                window.user_group   = data.record.group;
                console.log("use friends : ", window.user_friends );
                for(var i = 0; i<data.record.friends.length; i++){
                    li_item = document.createElement("li");
                    li_item.setAttribute("class", "buddy-item");
                    a_item = document.createElement("a");
                    a_item.appendChild(document.createTextNode(data.record.friends[i]));
                    a_item.setAttribute('href', "javascript:register_popup('" + data.record.friends[i] + "', '" + data.record.friends[i] + "');");
                    online_item = document.createElement("div");
                    online_item.setAttribute("class", "profile-status offline");
                    console.log("data.record.friends", data.record.friends[i]);
                    online_item.setAttribute("id", data.record.friends[i] + "-item");
                    li_item.appendChild(a_item);
                    li_item.appendChild(online_item);
                    ul_item.appendChild(li_item);
                }
                s.appendChild(ul_item);
                $("#chat-container #friends .num").text(" [ " + data.record.friends.length + " ]");
                
                socket.emit('appendBuddyGroup', {friends : window.user_friends,
                                                 group : window.user_group}); 
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("get friends error");
            }            
        });
    });    
});

Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
            
            document.getElementById(id).style.display = "none";
            
            calculate_popups();
            
            return;
        }
    }   
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 250;
    
    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }
    
    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name)
{
    
    for(var iii = 0; iii < popups.length; iii++){   
        //already registered. Bring it to front.
        if(id == popups[iii]){
            Array.remove(popups, iii);
            popups.unshift(id);
            calculate_popups();
            return;
        }
    } 
    
    var element = '<div class="popup-box chat-popup" id="'+ id +'">';
    element = element + '<div class="popup-head">';
    element = element + '<div class="popup-head-left">'+ name +'</div>';
    element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
    // element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div><input class="message-input" ' + 'id="' + name +'-message"' +'></div>';
    element = element + '<div style="clear: both"></div></div>';

    var hasMsg = false;
    for (var i in notify_msg) {
        if (notify_msg.hasOwnProperty(i)){
            hasMsg = true;
            var msg_items = "<ul>";
            $.each( notify_msg[i], function( key, value ) {                
                msg_items = msg_items +'<li>'+i+ ':'+value+ '</li>';
            });
            msg_items = msg_items + '</ul>';                    
            element = element + '<div class="popup-messages" id="'+name+'-msg">'+msg_items + '</div>';
            delete notify_msg[i];
        }
    }
    if(!hasMsg){
        element = element + '<div class="popup-messages" id="'+name+'-msg"></div>';
    }
    element = element + '<input class="message-input" ' + 'id="' + name +'-message"' +'></div>';

    notify_msg = {};
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;

    // $("#" + name + '-message').focus();
    
    $('.message-input').keypress(function(e) {        
		if(e.which == 13) {
			$(this).blur();
			// $('#datasend').focus().click();
            $("#"+name+"-msg").append($('<p>').text($("#nav-tools-user").text() + " : " + $('#'+name+"-message").val()));
            console.log("send message", $('#'+name+"-message").val());   
            socket.emit("message", {msg:$('#'+name+"-message").val(),username:$("#nav-tools-user").text() , rival_name:name});
            $('#'+name+"-message").val('');
		}
	});
    popups.unshift(id);    
    calculate_popups();    
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    
    display_popups();
    
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);


// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    console.log("send a connect request");
    console.log("user_friends in buddy.js", window.user_friends);
	// call the server-side function 'adduser' and send one parameter (value of prompt)
	// socket.emit('adduser', prompt("What's your name?"));
    socket.emit('adduser', {username: $('#nav-tools-user-link').text()});                                                       
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
    console.log("update chate");
	$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
});

socket.on('updateOnlineStatus', function(onlineStatus){
    console.log("onlineStatus : ", onlineStatus);
    for(var i = 0; i<window.user_friends.length; i++){
        if(onlineStatus[window.user_friends[i]]){
            $('#' + window.user_friends[i] + "-item").attr("class", "profile-status online");
        }
    }    
});

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function(rooms, current_room) {
	$('#rooms').empty();
	$.each(rooms, function(key, value) {
		if(value == current_room){
			$('#rooms').append('<div>' + value + '</div>');
		}
		else {
			$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
		}
	});
});
socket.on("reply message", function(msg){
    // alert(msg.rival_name + " : " + msg.data);
    if (document.getElementById(msg.rival_name)){
        $('.popup-messages').append($('<p>').text(msg.username + " : " + msg.data));
    }else{
        // $("#notification-count").attr("class", "");
        $("#notification-count").text("1");
        $("#notification-count").show();
    }

    if(msg.username in notify_msg){
        notify_msg[msg.username].push(msg.data);
    }else{
        notify_msg[msg.username] = [];
        notify_msg[msg.username].push(msg.data);        
    }
});

function switchRoom(room){
	socket.emit('switchRoom', room);
}










