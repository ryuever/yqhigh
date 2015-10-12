$(document).ready(function(){
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
                // alert("successful");
                // console.log(data.record.friends);
                // alert(data.record.friends);
                var s=document.getElementById('buddy-collection');
                var li_item;
                var a_item;
                var online_item;
                var ul_item = document.createElement("ul");
                for(var i = 0; i<data.record.friends.length; i++){
                    li_item = document.createElement("li");
                    li_item.setAttribute("class", "buddy-item");
                    a_item = document.createElement("a");
                    a_item.appendChild(document.createTextNode(data.record.friends[i]));
                    a_item.setAttribute('href', "javascript:register_popup('" + data.record.friends[i] + "', '" + data.record.friends[i] + "');");
                    online_item = document.createElement("div");
                    online_item.setAttribute("class", "profile-status online");
                    li_item.appendChild(a_item);
                    li_item.appendChild(online_item);
                    ul_item.appendChild(li_item);
                }
                s.appendChild(ul_item);
                // alert(record.friends);
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
    
    for(var iii = 0; iii < popups.length; iii++)
    {   
        //already registered. Bring it to front.
        if(id == popups[iii])
        {
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
    element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div><form><input class="message-input"></form></div>';
    
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;      
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
