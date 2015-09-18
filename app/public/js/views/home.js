
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
    
	// $('#account-form').ajaxForm({
	// 	beforeSubmit : function(formData, jqForm, options){
	// 		if (av.validateForm() == false){
	// 			return false;
	// 		} 	else{
	// 		// push the disabled username field onto the form data array //
	// 			formData.push({name:'user', value:$('#user-tf').val()})
	// 			return true;
	// 		}
	// 	},
	// 	success	: function(responseText, status, xhr, $form){
	// 		if (status == 'success') hc.onUpdateSuccess();
	// 	},
	// 	error : function(e){
	// 		if (e.responseText == 'email-taken'){
	// 			av.showInvalidEmail();
	// 		}	else if (e.responseText == 'username-taken'){
	// 			av.showInvalidUserName();
	// 		}
	// 	}
	// });

    $('a').click(function(e) {
        e.preventDefault();
        var link = $(this).attr('href');
        $.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            contentType: 'application/json',
            error: function (err) {
                alert("error - " + err);
            },
            success	: function(responseText, status, xhr, $form){
			    if (status == 'success'){
                    var parent = document.getElementById("user-container");
                    var temp_div = document.createElement('div');
                    temp_div.id = "temp_div";
                    parent.appendChild(temp_div);
                    
                    var child = document.getElementById("pp");
                    parent.removeChild(child);
                    
                    var button_attendance = document.createElement('button');
                    button_attendance.id = "my-attendance";
                    button_attendance.className = "btn btn-default party-ctl";
                    button_attendance.type = "button";
                    button_attendance.innerHTML = "我参加的";
                    var button_party_list = document.createElement('button');
                    button_party_list.id = "party-list";
                    button_party_list.className = "btn btn-default party-ctl";
                    button_party_list.type = "button";
                    button_party_list.innerHTML = "所有列表";                    
                    var button_create_request = document.createElement('button');
                    button_create_request.id = "create-request";
                    button_create_request.className = "btn btn-default party-ctl";
                    button_create_request.type = "button";
                    button_create_request.innerHTML = "创建";                    
                    
                    var Div_1 = document.createElement('div');
                    Div_1.id = 'party-dashboard';
                    Div_1.appendChild(button_attendance);
                    Div_1.appendChild(button_party_list);
                    Div_1.appendChild(button_create_request);
                    temp_div.appendChild(Div_1);

                    var button_temp = document.createElement('button');
                    button_temp.innerHTML = "me";
                    // document.location.hash = "party";

                    $('#my-attendance').click(function(){
                        alert("attendance");
                    });

                    var party_form = document.createElement('FORM');
                    party_form.className = "form-horizontal well span6";
                    party_form.id = "party_form";
                    party_form.setAttribute("method","post");

                    var party_form_p = document.createElement('P');
                    var t = document.createTextNode("Please tell us a little about the party.");    // Create a text node
                    party_form_p.appendChild(t);
                    party_form_p.className = "subheading";
                    party_form_p.id = "sub1";
                    party_form.appendChild(party_form_p);

                    var party_form_hr = document.createElement('hr');
                    party_form.appendChild(party_form_hr);

                    var party_form_fieldset = document.createElement("fieldset");
                    
                    var party_form_name_group = document.createElement("div");
                    party_form_name_group.className = "control-group";
                    party_form_name_group.id = "name-cg";
                    var party_form_fieldset_label_name = document.createElement("label");
                    party_form_fieldset_label_name.className = "control-label";
                    party_form_fieldset_label_name.appendChild(document.createTextNode("Party Description"));
                    party_form_name_group.appendChild(party_form_fieldset_label_name);
                    var party_form_name_group_control = document.createElement("div");
                    party_form_name_group_control.className = "controls";
                    var party_form_name_input = document.createElement('input');
                    party_form_name_input.id = "name-tf";
                    party_form_name_input.name = 'name';
                    party_form_name_input.value = responseText.udata['name'];
                    party_form_name_group_control.appendChild(party_form_name_input);
                    party_form_name_group.appendChild(party_form_name_group_control);
                    party_form_fieldset.appendChild(party_form_name_group);
                    party_form.appendChild(party_form_fieldset);

                    var party_form_date_group = document.createElement("div");
                    party_form_date_group.className = "control-group";
                    party_form_date_group.id = "name-cg";
                    var party_form_fieldset_label_date = document.createElement("label");
                    party_form_fieldset_label_date.className = "control-label";
                    party_form_fieldset_label_date.appendChild(document.createTextNode("choose a date"));
                    party_form_date_group.appendChild(party_form_fieldset_label_date);
                    var party_form_date_group_control = document.createElement("div");
                    party_form_date_group_control.className = "controls";
                    var party_form_date_input = document.createElement('input');
                    party_form_date_input.id = "name-tf";
                    party_form_date_input.name = 'name';
                    party_form_date_input.value = responseText.udata['name'];
                    party_form_date_group_control.appendChild(party_form_date_input);
                    party_form_date_group.appendChild(party_form_date_group_control);
                    party_form_fieldset.appendChild(party_form_date_group);

                    var party_form_type_group = document.createElement("div");
                    party_form_type_group.className = "control-group";
                    party_form_type_group.id = "type-cg";
                    var party_form_type_btn = document.createElement("button");
                    party_form_type_btn.type="button";
                    party_form_type_btn.className="btn btn-default btn-lg";
                    party_form_type_btn.id = "party_form_type_btn";
                    party_form_type_btn.appendChild(document.createTextNode("火锅"));
                    party_form_type_group.appendChild(party_form_type_btn);
                    party_form_fieldset.appendChild(party_form_type_group);
                    
                    var Div_2 = document.createElement('div');
                    Div_2.id = 'party-scratch';
                    Div_2.appendChild(party_form);

                    temp_div.appendChild(Div_2);                    

                    var party_form_type_modal = document.createElement("div");
                    party_form_type_modal.className = "modal fade";
                    party_form_type_modal.id = "myModal";
                    // party_form_type_modal.role = "dialog";
                    party_form_type_modal.setAttribute('role', 'dialog');
                    var party_form_type_modal_dialog = document.createElement("div");
                    party_form_type_modal_dialog.className = "modal-dialog";

                    party_form_type_modal.appendChild(party_form_type_modal_dialog);
                    var party_form_type_modal_dialog_content = document.createElement("div");
                    party_form_type_modal_dialog_content.className = "modal-content";

                    var party_form_type_modal_dialog_header = document.createElement("div");
                    party_form_type_modal_dialog_header.setAttribute("style", "padding:35px 50px;");
                    var party_form_type_modal_dialog_header_btn = document.createElement("button");
                    party_form_type_modal_dialog_header_btn.className = "close";
                    party_form_type_modal_dialog_header_btn.setAttribute("type", "button");
                    party_form_type_modal_dialog_header_btn.setAttribute("data-dismiss", "modal");
                    party_form_type_modal_dialog_header_btn.appendChild(document.createTextNode("X"));
                    party_form_type_modal_dialog_header.appendChild(party_form_type_modal_dialog_header_btn);
                    var party_form_type_modal_dialog_content_span = document.createElement("span");
                    // party_form_type_modal_dialog_content_span.className = "glyphicon glyphicon-lock";
                    party_form_type_modal_dialog_content_span.appendChild(document.createTextNode("列表"));
                    party_form_type_modal_dialog_header.appendChild(party_form_type_modal_dialog_content_span);
                    party_form_type_modal_dialog_content.appendChild(party_form_type_modal_dialog_header);
                    
                    var party_form_type_hr = document.createElement('hr');
                    party_form_type_modal_dialog_content.appendChild(party_form_type_hr);
                    
                    var food = ['牛肉', '猪肉', '鱼', '鸡肉', '里脊', '五花肉', "香肠"];
                    var party_modal_table = document.createElement("table");
                    party_modal_table.setAttribute('style', 'width:100%');
                    for (var i=0;i<food.length;i++){

                        if (i%5 == 0){
                            if (i > 0){
                                party_modal_table.appendChild(food_tr);
                            }
                            var food_tr =  document.createElement("tr");
                        }

                        var food_item = document.createElement("td");
                        var party_modal_form_label =  document.createElement("label");
                        var party_modal_form_input =  document.createElement("input");
                        party_modal_form_input.type = "checkbox";
                        party_modal_form_input.value = food[i];
                        party_modal_form_input.setAttribute("class",'food_checkbox');                        
                        party_modal_form_label.appendChild(document.createTextNode(food[i]));
                        party_modal_form_label.appendChild(party_modal_form_input);
                        food_item.appendChild(party_modal_form_label);
                        food_tr.appendChild(food_item);
                    }
                    
                    if(food.length % 5 != 0){
                        party_modal_table.appendChild(food_tr);
                    }                    
                    party_form_type_modal_dialog_content.appendChild(party_modal_table);

                    var submit_modal_form_btn = document.createElement("button");
                    submit_modal_form_btn.setAttribute("id", "food_submit");                   
                    submit_modal_form_btn.setAttribute("class", "btn btn-success btn-block"); 
                    submit_modal_form_btn.setAttribute("data-dismiss", "modal");                    
                    submit_modal_form_btn.appendChild(document.createTextNode("submit"));                    
                    party_form_type_modal_dialog_content.appendChild(submit_modal_form_btn);                    
                    party_form_type_modal_dialog.appendChild(party_form_type_modal_dialog_content);
                    temp_div.appendChild(party_form_type_modal);

                    // form submit button

                    var party_form_btn1 = document.createElement("button");
                    party_form_btn1.setAttribute("class", "btn");
                    party_form_btn1.setAttribute("id", "party_form_btn1");
                    party_form_btn1.setAttribute("type", "submit");
                    party_form_btn1.appendChild(document.createTextNode("Submit"));                   
                    var party_form_btn2 = document.createElement("button");
                    party_form_btn2.setAttribute("class", "btn");
                    party_form_btn2.setAttribute("id", "party_form_btn2");
                    party_form_btn2.setAttribute("type", "button");
                    party_form_btn2.appendChild(document.createTextNode("Cancel"));
                    party_form_fieldset.appendChild(party_form_btn1);
                    party_form_fieldset.appendChild(party_form_btn2);

                    // ----------------------------------------------//
                    var submit_alert_modal = document.createElement("div");
                    submit_alert_modal.className = "modal fade";
                    submit_alert_modal.id = "submit_alert_modal";
                    // party_form_type_modal.role = "dialog";
                    submit_alert_modal.setAttribute('role', 'dialog');
                    var submit_alert_modal_dialog = document.createElement("div");
                    submit_alert_modal_dialog.className = "modal-dialog";

                    submit_alert_modal.appendChild(submit_alert_modal_dialog);
                    var submit_alert_modal_dialog_content = document.createElement("div");
                    submit_alert_modal_dialog_content.className = "modal-content";
                    
                    // var submit_alert = document.createElement('div');
                    // submit_alert.setAttribute('class', 'modal fade');
                    // submit_alert.setAttribute('id', 'submit_alert');
                    // submit_alert.setAttribute('role', 'dialog');
                    var submit_alert_header = document.createElement('div');
                    submit_alert_header.setAttribute('class', 'modal-header');
                    var submit_alert_btn = document.createElement('button');
                    submit_alert_btn.setAttribute('class', 'close');
                    submit_alert_btn.setAttribute('data-dismiss', 'modal');
                    submit_alert_btn.appendChild(document.createTextNode("x"));
                    submit_alert_header.appendChild(submit_alert_btn);
                    var submit_alert_header_h3 = document.createElement('h3');
                    submit_alert_header_h3.appendChild(document.createTextNode('Success !'));
                    submit_alert_header.appendChild(submit_alert_header_h3);                    
                    submit_alert_modal_dialog_content.appendChild(submit_alert_header);

                    var submit_alert_body = document.createElement('div');
                    submit_alert_body.setAttribute('class', 'modal-body');
                    submit_alert_body.appendChild(document.createElement('p'));

                    var submit_alert_footer = document.createElement('div');
                    submit_alert_footer.setAttribute('class', 'modal-footer');
                    submit_alert_footer_btn = document.createElement('button');
                    submit_alert_footer_btn.setAttribute('class', 'btn btn-warning');
                    submit_alert_footer_btn.setAttribute('data-dismiss', 'modal');
                    submit_alert_footer_btn.setAttribute('id', 'ok');
                    submit_alert_footer_btn.appendChild(document.createTextNode("OK"));

                    submit_alert_modal_dialog_content.appendChild(submit_alert_header);
                    submit_alert_modal_dialog_content.appendChild(submit_alert_body);
                    submit_alert_modal_dialog_content.appendChild(submit_alert_footer);
                    submit_alert_modal_dialog.appendChild(submit_alert_modal_dialog_content);
                    submit_alert_modal.appendChild(submit_alert_modal_dialog);
                    temp_div.appendChild(submit_alert_modal);

                    
                    $('#party_form_type_btn').click(function(){
                        $("#myModal").modal('show');
                    });

                    $('#food_submit').click(function(){
                        var checkedValue = null; 
                        var inputElements = document.getElementsByClassName('food_checkbox');

                        var food_list = document.createElement("table");
                        food_list.setAttribute('style', 'width:50%');
                        var scratch_food_tr = document.createElement("tr");                                    
                        var scratch_food_item = document.createElement("td");
                        var scratch_food_item_label =  document.createElement("label");
                        
                        for(var checked_i=0; checked_i < inputElements.length ; checked_i++){
                            if(inputElements[checked_i].checked){
                                if (checked_i % 5 == 0){
                                    if (checked_i > 0){
                                        food_list.appendChild(scratch_food_tr);
                                    }
                                    scratch_food_tr = document.createElement("tr");
                                }
                                scratch_food_item = document.createElement("td");
                                scratch_food_item_label =  document.createElement("label");
                                scratch_food_item_label.appendChild(document.createTextNode(inputElements[checked_i].value));
                                scratch_food_item.appendChild(scratch_food_item_label);
                                console.log(scratch_food_tr);                                
                                scratch_food_tr.appendChild(scratch_food_item);
                            }
                        }

                        if(inputElements.length % 5 != 0){
                            food_list.appendChild(scratch_food_tr);                            
                    }                    
                    party_form_type_group.appendChild(food_list); 
                    });

                    
	                $('#party_form').ajaxForm({
                        url : 'http://localhost:3000/party',
                        data : {
                            party_des : "huoguo",
                            party_time : "0102",
                            party_food : "pork"
                        }, 
		                beforeSubmit : function(formData, jqForm, options){
                            console.log("sent request");
			                // return av.validateForm();
		                },
		                success	: function(responseText, status, xhr, $form){
                            // console.log("success");
			                if (status == 'success')
                                $('#submit_alert_modal').modal('show');
		                },
		                error : function(e){
			                if (e.responseText == 'email-taken'){
			                    av.showInvalidEmail();
			                }	else if (e.responseText == 'username-taken'){
			                    av.showInvalidUserName();
			                }
		                }
	                });                    
                }                
		    }
        });
    });
    
	$('#name-tf').focus();
	$('#github-banner').css('top', '41px');

// customize the account settings form //
	
	$('#account-form h1').text('Account Settings');
	$('#account-form #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');
})
