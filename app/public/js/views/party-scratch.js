$(document).ready(function(){

    $("#huoguo").change(function() {
        if(this.checked) {
            $("#huoguo-modal").modal();
        }
    });

    $("#huoguo-submit").click(function(){
        var checkedValue = null; 
        var inputElements = document.getElementsByClassName('food_checkbox');

        var food_list = document.createElement("table");
        food_list.setAttribute('style', 'width:50%');
        var scratch_food_tr = document.createElement("tr");                                    
        var scratch_food_item = document.createElement("td");
        var scratch_food_item_label =  document.createElement("label");
        var checked_count = 0;
        for(var checked_i=0; checked_i < inputElements.length ; checked_i++){
            if(inputElements[checked_i].checked){
                if (checked_i % 5 == 0){
                    if (checked_i > 0){
                        food_list.appendChild(scratch_food_tr);
                    }
                    scratch_food_tr = document.createElement("tr");
                }

                // console.log(inputElements[checked_i].value);
                scratch_food_item = document.createElement("td");
                scratch_food_item_label = document.createElement("label");
                scratch_food_item_label.appendChild(document.createTextNode(inputElements[checked_i].value));
                scratch_food_item.appendChild(scratch_food_item_label);
                // console.log(scratch_food_tr);                                
                scratch_food_tr.appendChild(scratch_food_item);
                checked_count++;
            }
        }

        console.log(scratch_food_tr);

        if(checked_count % 5 != 0){
            food_list.appendChild(scratch_food_tr);                            
        }
        console.log(food_list);
        $("#create-party-form").append(food_list); 
    });
    
    $("#kaorou").change(function() {
        if(this.checked) {
            $("#kaorou-modal").modal();
        }
    });    
    $("#jiaozi").change(function() {
        if(this.checked) {
            $("#jiaozi-modal").modal();
        }
    });

    var food = {"meat":['牛肉', '猪肉', '鱼', '鸡肉', '里脊', '五花肉', "香肠"],
                "vegetable":['白菜', "豆芽", "黄瓜"]};

    for (var key in food){
        var item = document.createElement("h3");
        item.appendChild(document.createTextNode(key));
        $("#huoguo-modal .modal-body").append(item);
        $("#huoguo-modal .modal-body").append(document.createElement('hr'));

        var huoguo_table = document.createElement("table");
        // huoguo_table.setAttribute('style', 'width:100%');

        for (var i=0;i<food[key].length;i++){        
            if (i%4 == 0){
                if (i > 0){
                    huoguo_table.appendChild(food_tr);
                }
                var food_tr =  document.createElement("tr");
            }
            // var food_item_1 = document.createElement("td");
            // var party_modal_form_label =  document.createElement("label");
            // party_modal_form_label.appendChild(document.createTextNode(food[i]));
            // food_item_1.appendChild(party_modal_form_label);

            // var food_item_2 = document.createElement("td");
            // var party_modal_form_input =  document.createElement("input");
            // party_modal_form_input.type = "checkbox";
            // party_modal_form_input.value = food[i];
            // party_modal_form_input.setAttribute("class",'food_checkbox');                        

            // food_item_2.appendChild(party_modal_form_input);
            // food_tr.appendChild(food_item_1);
            // food_tr.appendChild(food_item_2);

            var food_item = document.createElement("td");
            var huoguo_food_label = document.createElement("label");
            huoguo_food_label.appendChild(document.createTextNode(food[key][i]));
            food_item.appendChild(huoguo_food_label);

            var huoguo_food_input =  document.createElement("input");
            huoguo_food_input.type = "checkbox";
            huoguo_food_input.value = food[key][i];
            huoguo_food_input.setAttribute("class",'food_checkbox');                        

            food_item.appendChild(huoguo_food_input);
            food_tr.appendChild(food_item);
        }
        
        if(food.length % 4 != 0){
            huoguo_table.appendChild(food_tr);
        }                    
        $("#huoguo-modal .modal-body").append(huoguo_table);
    }


});
