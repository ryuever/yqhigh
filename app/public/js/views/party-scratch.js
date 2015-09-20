$(document).ready(function(){

    $("#party-time").datetimepicker();

    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
    // modal initialization    
    var huoguo = document.getElementById('selected-huoguo-food');
    huoguo.setAttribute('title', "selected food");
    huoguo.setAttribute('data-content', "No food");
    huoguo.setAttribute('data-html', "true");
    $('#selected-huoguo-food').popover();

    var kaorou = document.getElementById('selected-kaorou-food');
    kaorou.setAttribute('title', "selected food");
    kaorou.setAttribute('data-content', "No food");    
    kaorou.setAttribute('data-html', "true");
    $('#selected-kaorou-food').popover();

    var jiaozi = document.getElementById('selected-jiaozi-food');
    jiaozi.setAttribute('title', "selected food");
    jiaozi.setAttribute('data-content', "No food");    
    jiaozi.setAttribute('data-html', "true");
    $('#selected-jiaozi-food').popover();
    
    $("#huoguo").change(function() {
        if(this.checked) {
            $("#huoguo-modal").modal();
        }else{
            huoguo.setAttribute('data-content', "No food");
        }
    });

    $("#kaorou").change(function() {
        if(this.checked) {
            $("#kaorou-modal").modal();
        }else{
            kaorou.setAttribute('data-content', "No food");
        }        
    });    
    $("#jiaozi").change(function() {
        if(this.checked) {
            $("#jiaozi-modal").modal();
        }else{
            jiaozi.setAttribute('data-content', "No food");
        }        
    });

    // initilize modal table's elements
    function initialize_modal_table(food, type){
        for (var key in food){
            var item = document.createElement("h3");
            item.appendChild(document.createTextNode(key));
            if (type == 'huoguo'){
                $("#huoguo-modal .modal-body").append(item);
                $("#huoguo-modal .modal-body").append(document.createElement('hr'));
            }else if(type == 'kaorou'){
                $("#kaorou-modal .modal-body").append(item);
                $("#kaorou-modal .modal-body").append(document.createElement('hr'));                
            }else if(type == 'jiaozi'){
                $("#jiaozi-modal .modal-body").append(item);
                $("#jiaozi-modal .modal-body").append(document.createElement('hr'));                
            } else{
                console.log("error : please input valid food type");
            }
            var table = document.createElement("table");

            for (var i=0;i<food[key].length;i++){        
                if (i%4 == 0){
                    if (i > 0){
                        table.appendChild(food_tr);
                    }
                    var food_tr =  document.createElement("tr");
                }

                var food_item = document.createElement("td");
                var food_label = document.createElement("label");
                food_label.appendChild(document.createTextNode(food[key][i]));
                food_item.appendChild(food_label);

                var food_input =  document.createElement("input");
                food_input.type = "checkbox";
                food_input.value = food[key][i];
                if (type == 'huoguo'){
                    food_input.setAttribute("class",'huoguo_food_checkbox');
                } else if (type == 'kaorou'){
                    food_input.setAttribute("class",'kaorou_food_checkbox');
                } else if (type == 'jiaozi'){
                    food_input.setAttribute("class",'jiaozi_food_checkbox');
                } else{
                    console.log("error : please input valid food type");
                }

                food_item.appendChild(food_input);
                food_tr.appendChild(food_item);
            }
            
            if(food.length % 4 != 0){
                table.appendChild(food_tr);
            }
            if (type == 'huoguo'){
                $("#huoguo-modal .modal-body").append(table);                
            } else if (type == 'kaorou'){
                $("#kaorou-modal .modal-body").append(table);
            } else if (type == 'jiaozi'){
                $("#jiaozi-modal .modal-body").append(table);                
            } else{
                console.log("error : please input valid food type");
            }
        }        
    }
    
    var huoguo_food = {"meat":['牛肉', '猪肉', '鱼', '鸡肉', '里脊', '五花肉', "香肠"],
                       "vegetable":['白菜', "豆芽", "黄瓜"]};
    initialize_modal_table(huoguo_food, "huoguo");

    var jiaozi_food = {"meat":['猪肉白菜', "牛肉白菜"],
                       "vegetable":['韭菜鸡蛋', "香菇", "黄瓜"],
                       "seafood":["鲜虾馅"]};        
    initialize_modal_table(jiaozi_food, "kaorou");

    var kaorou_food = {"meat":['牛肉', '猪肉', '鱼', '鸡肉', '肥肠'],
                       "vegetable":['玉米', "毛豆", "辣白菜"]};
    initialize_modal_table(kaorou_food, "jiaozi");

    // button click event on modal dialog
    function acquire_selected_options(type){
        var checkedValue = null;
        var intputElements = null;
        if (type == 'huoguo'){
            inputElements = document.getElementsByClassName('huoguo_food_checkbox');
        } else if (type == 'kaorou'){
            inputElements = document.getElementsByClassName('kaorou_food_checkbox');
        } else if (type == 'jiaozi'){
            inputElements = document.getElementsByClassName('jiaozi_food_checkbox');
        } else{
            console.log("error : please input valid food type");
        }
        
        var food_list = document.createElement("table");
        food_list.setAttribute('class', 'table');
        var scratch_food_tr = document.createElement("tr");                                    
        var scratch_food_item = document.createElement("td");
        var scratch_food_item_label =  document.createElement("label");
        var checked_count = 0;
        for(var checked_i=0; checked_i < inputElements.length ; checked_i++){
            if(inputElements[checked_i].checked){
                if (checked_count % 3 == 0){
                    if (checked_i > 0){
                        food_list.appendChild(scratch_food_tr);
                    }
                    scratch_food_tr = document.createElement("tr");
                }
                scratch_food_item = document.createElement("td");
                scratch_food_item_label = document.createElement("label");
                scratch_food_item_label.appendChild(document.createTextNode(inputElements[checked_i].value));
                scratch_food_item.appendChild(scratch_food_item_label);
                scratch_food_tr.appendChild(scratch_food_item);
                checked_count++;
            }
        }

        food_list.appendChild(scratch_food_tr);
        console.log(food_list);
        // convert html object to string
        return food_list.outerHTML;
    }
    $("#huoguo-submit").click(function(){
        huoguo.setAttribute('data-content', acquire_selected_options("huoguo"));
    });    
    $("#kaorou-submit").click(function(){
        kaorou.setAttribute('data-content', acquire_selected_options("kaorou"));
    });    
    $("#jiaozi-submit").click(function(){
        jiaozi.setAttribute('data-content', acquire_selected_options("jiaozi"));
    });        
});
