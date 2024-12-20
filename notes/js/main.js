"use strict";

// AJAX CONFIG 
let CanSendAjax = true; 
$.ajaxSetup({
  beforeSend: function(){ 
	CanSendAjax = false; 
  },
  complete:   function(){ 
	console.log("complete AJAX");  
	CanSendAjax = true;  
  }
}); 

$(function(){
	
	let col_nav    = ".col_nav",   
	btn_col        = ".col_btn",  
	btn_col_mobile = ".col_btn_mobile", 
	main_tools     = "#main_tools", 
	main_columns   = "#main_columns", 
	item_elem      = "#main_columns [data-id]",
	btn_shrink     = "#btn_shrink_menu", 
	btn_settings   = "#btn_settings",
	btn_add        = "#btn_add",
	btn_edit       = "#btn_edit",
	btn_edit_menu  = "#btn_edit_menu",
	btn_save       = "#btn_save",
	btn_delete     = "#btn_delete", 
	btn_enter      = "#btn_enter",
	btn_reload     = "#btn_reload", 
	btn_wide       = "#btn_wide", 
	btn_vim        = "#btn_vim", 
	btn_hotkey     = "#btn_hotkey", 
	passBlock      = "#pass",  
	passEye        = "#pass_eye", 
	mobileWidth    = 970,  
	id             = 0;
	
	let reloadCounter  = 0; 
	
	let ajaxURL          = "ajax/"; 
	 
	let passSalt         = "scaramanga2017"; 
	let hash             = ""; 
	
	let statusContainter = "#status_container", 
	    statusLoader     = "#status_loader", 
        statusText       = "#status_text"; 

	let editor           = {}; 
	let introText        = "Welcome!"; 
	
	let OBJ     = {"ITEM_ID":0, "ITEM_NAME":""};   
	let ID_NEW  = 0; // add new id 
	
	let passVal = "";  
	
	// EVENTS 
	
	$(document).on("submit", "#form_enter", enterApp);  
	$(document).on("submit", ".action_form", sendActionForm);  
	$(document).on("click", btn_wide, openWindowWide); 
	$(document).on("click", btn_add, openWindowAdd); 
	$(document).on("click", btn_edit, openWindowEdit); 
	$(document).on("click", btn_edit_menu, openWindowEditMenu); 
	$(document).on("click", btn_delete, openWindowConfirmDelete); 
	$(document).on("click", btn_settings, openSettings);
	$(document).on("click", btn_shrink, toggleMenu); 
	$(document).on("click", btn_col, toggleColumnsMenu); 
	$(document).on("click", btn_col_mobile, activateColumnMobile); 
	$(document).on("click", btn_save, saveNote); 
	$(document).on("click", passEye, switchPassInput); 
	$(document).on("click", ".close-fancy", function(){ $.fancybox.close(); }); 
	$(document).on("click", item_elem, getNote);
	$(document).on("click", btn_vim, toogleVim);  
	$(document).on("click", btn_hotkey, openWindowHotkeys);  
	
	// HOT KEYS   
	
	initHotPassEye(); 

	function initHotPassEye(){ 
		
		initKeyFilter(); 
		
		// Show/Hide Password Text 
		key('alt+a', 'input', function(event){
			console.log("KEY PASS EYE");  
			if($(event.target).attr("id") == "pass"){
				$(passEye).trigger("click"); 
			}
			return false; 
		}); 
		
	}
	
	function initHotKeys(){
		
		initKeyFilter(); 
		
		// Add Item
		key('command+o, ctrl+o', function(){   
			$(btn_add).trigger("click");
			return false; 
		});
		
		// Save Item
		key('command+s, ctrl+s', 'input', function(){ 
			$.fancybox.close(); 
			$(btn_save).trigger("click");  
			return false;
		});
		
		// Edit Item
		key('command+e, ctrl+e', function(){ 
			$(btn_edit).trigger("click"); 
			return false;
		});
		
		// Edit Menu 
		key('command+m, ctrl+m', function(){ 
			$(btn_edit_menu).trigger("click"); 
			return false;
		});
		
		// Collapse Menu 
		key('command+left, ctrl+left', function(){  
			$.fancybox.close(); 
			$(col_nav).removeClass("active");  
			return false;
		});
		
		// Expand Menu 
		key('command+right, ctrl+right', function(){  
			$.fancybox.close();  
			$(col_nav).addClass("active"); 
			return false; 
		}); 
		
		// Reset Interface 
		key('escape', function(){   
			$.fancybox.close(); 
			if($(btn_settings).hasClass("active")){
				$(btn_settings).trigger("click"); 
			} 
			if(!$(btn_shrink).hasClass("active")){
				$(btn_shrink).trigger("click");
			} 
			$(col_nav).addClass("active");  
			return false;
		}); 
		
		key('alt+enter', function(){    
			keyEnterNote(); 
			return false; 
		}); 
		
		key('alt+left', function(){   
			keyPrevColNote();
			return false; 
		}); 
		
		key('alt+right', function(){   
			keyNextColNote();
			return false; 
		}); 
		
		key('alt+up', function(){
			keyPrevNote();
			return false; 
		}); 
		
		key('alt+down', function(){   
			keyNextNote(); 
			return false; 
		}); 
		
	} 
	
	function keyEnterNote(){ 
		$(col_nav).find("li.active_key a").trigger("click"); 
	}
	
	function keyNextNote(){ 
		if( $(col_nav).find("li.active").last().length > 0 && $(col_nav).find("li.active_key").length == 0) { 
			$(col_nav).find("li.active").last().next().addClass("active_key"); 
		} else if( $(col_nav).find("li.active_key").length > 0 ) { 
			$(col_nav).find("li.active_key").next().addClass("active_key"); 
			$(col_nav).find("li.active_key").prev().removeClass("active_key"); 
		} else {
			$(col_nav).find("li").first().addClass("active_key");   
		}
	}
	
	function keyPrevNote(){ 
		if( $(col_nav).find("li.active").last().length > 0 && $(col_nav).find("li.active_key").length == 0) { 
			$(col_nav).find("li.active").last().prev().addClass("active_key"); 
		} else if( $(col_nav).find("li.active_key").length > 0 ) { 
		    $(col_nav).find("li.active_key").prev().addClass("active_key"); 
		    $(col_nav).find("li.active_key").next().removeClass("active_key"); 
		}	
	}
	
	function keyNextColNote(){ 
		if( $(col_nav).find("li.active").length > 0 && $(col_nav).find("li.active_key").length == 0) { 
			$(col_nav).find("li.active").parents(col_nav).next().find("li").first().addClass("active_key");
		} else if( $(col_nav).find("li.active_key").length > 0 ) { 	
			$(col_nav).find("li.active_key").parents(col_nav).next().find("li").first().addClass("active_key"); 
			$(col_nav).find("li.active_key").parents(col_nav).prev().find("li").removeClass("active_key"); 
		} 
	}
	
	function keyPrevColNote(){ 
		if( $(col_nav).find("li.active").length > 0 && $(col_nav).find("li.active_key").length == 0) { 
			$(col_nav).find("li.active").parents(col_nav).prev().find("li").first().addClass("active_key");
		} else if( $(col_nav).find("li.active_key").length > 0 ) { 	
			$(col_nav).find("li.active_key").parents(col_nav).prev().find("li").first().addClass("active_key"); 
			$(col_nav).find("li.active_key").parents(col_nav).next().find("li").removeClass("active_key"); 
		}
	}
	
	function keyResetActiveItems(){
		$(col_nav).find("li.active_key").removeClass("active_key"); 
	}
	
	function initKeyFilter(){
		// Activate Scope By Filter with Inputs 
		key.filter = function(event){
			var tagName = (event.target || event.srcElement).tagName;
			key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
			return true;
		}
	}
	
	function enterApp(e){
		
		e.preventDefault(); 
		let $form          = $(this), 
		    data           = $form.serializeObject();  
			data["cmd"]    = "enter"; 
			hash           = getPassHash();
		    data["hash"]   = hash;   

		if(data["pass"]){   
		
			AJAX(ajaxURL, data, "json")   
			.then(function(result){ 
				if(result["status"] == "ok"){ 
					switchPassEnter(true); 
					passVal = $(passBlock).val();  
				} else if(result["status"] == "errorConnect"){		
					statusMsg("Data Base Connection Error!", "danger");  
					return $.Deferred(); 
				} else if(result["status"] == "errorPass"){	
					statusMsg("Wrong Password!", "danger");  
					return $.Deferred(); 
				} else {
					switchPassEnter(false); 
					return $.Deferred(); 
				}  
			}).then(function(){ 
				return $.when(  
					$.post(ajaxURL, {"cmd": "inc_main_tools", "hash": hash, "data_type": "html"}),  
					$.post(ajaxURL, {"cmd": "inc_main_container", "hash": hash, "data_type": "html"}),  
					$.post(ajaxURL, {"cmd": "inc_navbar_tools", "hash": hash, "data_type": "html"})).done(
						function(res1, res2, res3){  
							$("#main_tools").html(res1[0]); 
							$("#main_container").html(res2[0]);
							$("#navbar_tools").html(res3[0]); 
					    }); 
			}).then(function(){ 
				return AJAX(ajaxURL, {"cmd":"list", "hash": hash}, "json");  
			}).then(function(result){
				editor = ace.edit("editor"); 
				EditorInit();  
				EditorSetLang("text"); 
				resetNote(); 
				clearAllData(); 
				setEditorData(introText);  
				if(result["items"]){ 
					loadCols(result, loadFirstLevel);   
				}
				if(reloadCounter == 0){ 
					initHotKeys(); 
				} 
				
				$(window).resize(adaptiveDesign).trigger("resize"); 
				$(btn_col_mobile).addClass("active"); 
				
				statusMsg("Success!", "success");   
				reloadCounter++; 
			}).fail(function(error){ 
				showErrorMessage("Error Load Appication!");   
			});	 
		} 
	}
	
	// DATA ITEMS 
	
	function loadCols(data, func){ 
		let dataEncrypted = {}, 
			template      = {}, 
			result        = ""; // html 
		
		if(data["items"].length > 0){ 
			
			// Decode name by underscore map method 
			dataEncrypted = _.object(_.map(data["items"], function (value, key) {
				let resValue  = value;
				resValue.name = DECRYPT(resValue.name); // decoded item name 
				return [key, resValue];  
			})); 
			
			// Sort by name  
			dataEncrypted    = _(dataEncrypted).chain().sortBy('name').value(); 
			data["items"]    = dataEncrypted; 
			template         = columnTemplate(); 
			result           = Handlebars.compile(template)(data); 
			
			func(result); // Callback function  
		} 
	} 
	
	function loadFirstLevel(result){ 
		$(main_columns).prepend(result); 
	}
	
	function loadChildLevel(result){ 
		$(result).insertAfter( $(col_nav).last() );   
	}
	
	function clearAllData(){ 
		$(col_nav).remove(); 
		clearEditorData(); 
	}
	
	function resetNote(){ 
		OBJ    = {"ITEM_ID":0, "ITEM_NAME":""}; 
		ID_NEW = 0; 
	}
	
	// TEMPLATES 
	
	function columnTemplate(){
		var Template = [`
			<div class="col_nav active"> 
   			  <div class="col_btn">
   	  			  <svg class="s_icon s_icon_open">
	    			<use xlink:href="img/bootstrap-icons.svg#arrow-left"/> 
	  			  </svg>
	              <svg class="s_icon s_icon_close">
	                <use xlink:href="img/bootstrap-icons.svg#arrow-right"/> 
	              </svg>
              </div>
			  <div class="col_btn_mobile"></div> 
              <div class="wrap_nav">
                <div class="list_menu">
                   <ul>
				   {{#each items}}
					 <li><a data-id="{{this.id}}">{{this.name}}</a></li>
				   {{/each}}
				   </ul>	 
			    </div>
              </div>
            </div>
		`];
		return Template.join(''); 
	}
	
	function openWindowWide(e){
		e.preventDefault(); 
		let text = getEditorData(); 
		if(text.length>0){			
			$.fancybox.open('<div class="modal_textarea"><textarea>'+text+'</textarea></div>', {
				baseClass: "full_fancy", 
			});  
		}
	} 
	
	function switchPassEnter(flag){
		if(flag){
			$("#block_enter_wrapper").hide();
			$(btn_reload).show();
		} else {
			$("#block_enter_wrapper").show();
			$(btn_reload).hide();
		}
	}
	
	function openWindowAdd(){
		if(CanSendAjax == false) {return false;} 
		AJAX('ajax/forms/form_add.php')
		.done(function(htmlForm){ 
			$.fancybox.open(htmlForm); 
			hideLoading();  
		}).fail(function(){
			showErrorMessage("Error Loading Form!");
		});
	}
	
	function openWindowEdit(){ 
		if(CanSendAjax == false) {return false;} 
		if(OBJ.ITEM_ID == 0){
			statusMsg("Please, Select Note!", "info"); 
			return; 
		} 
		AJAX('ajax/forms/form_edit.php', OBJ)
		.done(function(htmlForm){ 
			$.fancybox.open(htmlForm); 
			hideLoading();  
		}).fail(function(){
			showErrorMessage("Error Loading Form!");
		});
	}
	
	function openWindowEditMenu(){
	    if(CanSendAjax == false) {return false;} 
		AJAX('ajax/forms/form_tree_menu.php') 
		.done(function(htmlForm){ 
			$.fancybox.open(htmlForm, {
				baseClass: "fancy_tree_menu",   
				touch: false, 
				afterShow : function( instance, current ) {
					loadTreeMenu(); 
				}
			}); 
		}).fail(function(){
			showErrorMessage("Error Loading Form!");
		});
	}
	
	function openWindowHotkeys(){ 
		if(CanSendAjax == false) {return false;} 
		AJAX('ajax/includes/main_hotkeys.php') 
		.done(function(htmlResult){ 
			$.fancybox.open(htmlResult, { 
				touch: false, 
				afterShow : function( instance, current ) {
					hideLoading();
				}
			}); 
		}).fail(function(){
			showErrorMessage("Error Loading!");
		});
	}
	
	function openWindowConfirmDelete(){  
		if(CanSendAjax == false) {return false;} 
		if(OBJ.ITEM_ID == 0){
			statusMsg("Please, Select Note!", "info"); 
			return;
		} 
		AJAX('ajax/forms/form_delete.php', OBJ)
		.done(function(htmlForm){ 
			$.fancybox.open(htmlForm); 
			hideLoading(); 
		}).fail(function(){
			showErrorMessage("Error Loading Form!");
		});
	}
	
	function closeWindow(){
		console.log("closeWindow"); 
	}
	
	function toggleColumnsMenu(){
		let $self = $(this);
		if($self.parent().hasClass("active")){
			$self.parent().removeClass("active");
		} else {
			$self.parent().addClass("active");
		}
	}	
	
	function activateColumnMobile(){
		let $self = $(this);  
		$(main_columns).find(".col_nav").removeClass("active_mobile");  
		$self.parent().addClass("active_mobile");  
		$(main_columns).find(".col_btn_mobile").removeClass("active"); 
		$self.addClass("active"); 
	}
	
	function toggleMenu(){
		let $self    = $(this), 
		    $col_nav = $(col_nav);

		if($self.hasClass("active")){
			$self.removeClass("active");
			$col_nav.hide().removeClass("active"); 
			$(".main_flex").removeClass("mobile_menu_bg"); 
		} else {
			$self.addClass("active"); 
			$col_nav.show().addClass("active");   
			$(".main_flex").addClass("mobile_menu_bg"); 
		}
	}	
	
	function openSettings(){
		let $self      = $(this), 
		    $main_tools = $(main_tools);

		if($self.hasClass("active")){
			$self.removeClass("active"); 
			$main_tools.removeClass("active");
		} else {
			$self.addClass("active");
			$main_tools.addClass("active"); 
		};
	} 
	
	function saveNote(e){
		e.stopPropagation(); 
		
		if(OBJ.ITEM_ID==0){ 
			statusMsg("Please, Select Note!", "info");
			return; 
		} 
		
		let data  = {
			"cmd" : "save", 
			"id"  : OBJ.ITEM_ID, 
			"text": ENCRYPT(getEditorData()),
			"hash": hash
		};
		
		AJAX(ajaxURL, data).then(function(res){ 
			if(res["status"] == "ok"){
				statusMsg("Saved OK!", "success"); 
			} else {
				statusMsg("Server Error!", "danger");
			}
		}).fail(function(){ 
			statusMsg("Server Error!", "danger");  
		});
	}
	
	function getNote(){  
		
		let $self     = $(this); 
		OBJ.ITEM_ID   = $self.attr("data-id"); 
		OBJ.ITEM_NAME = $self.text(); 
		
		let data = {
			"cmd": "get_note", 
			"id":   OBJ.ITEM_ID,
			"hash": hash
		}
		
		AJAX(ajaxURL, data).then(function(res){ 
			if(res["status"] == "ok"){
				
				let isHasActiveKeyClass = $self.parent().hasClass("active_key"); 
				
				setEditorData(DECRYPT(res["text"]));  
				$self.parents(col_nav).find("li").removeClass("active");    
				$self.parent().addClass("active"); 
				if(isHasActiveKeyClass){ 
					$self.parent().addClass("active_key"); 
				} 
				
				// Remove All Next Childs 
				$self.parents(col_nav).nextAll(col_nav).remove(); 
				
				if(res["items"]){ 
					loadCols(res, loadChildLevel);   
				}
				
				if(ID_NEW){ 
					clickItem(ID_NEW); // if new item added 
					ID_NEW = 0;  
				} 
				
				// activate for Mobile Col
				$(col_nav).removeClass("active_mobile"); 
				$self.parents(col_nav).addClass("active_mobile"); 
				
				
				statusMsg("", "success");     
			} else {
				statusMsg("Server Error!", "danger");
			}
		}).fail(function(){ 
			statusMsg("Server Error!", "danger");   
		});
	}
	
	function switchPassInput(){ 
		let $passBlock = $(passBlock); 
		if($passBlock.attr("type")=="password"){
			$(this).addClass("open");
			$passBlock.attr("type","text");
		} else {
			$(this).removeClass("open");
			$passBlock.attr("type","password");
		}
	}
	
	// AJAX 
	
	function AJAX(url, data, dataType){ 
		return $.ajax({ 
			type:       "POST",
			dataType:   dataType, 
			url:        url,
			data:       data,  
			beforeSend: showLoading,
		});
	}

	// STATUS APP
	
	function statusMsg(text, code){
		let color = "#fff"; 
		
		if(code == "info") { color = "#b0d8ec"; }
		if(code == "danger") { color = "#ff5d58"; }
		if(code == "success") { color = "#9ae89a"; }
		
		$(statusContainter).addClass("active");
		$(statusText).addClass("active"); 
		$(statusText).html('<span style="color:'+color+'">'+text+'</span>');
		
		setTimeout(function(){ 
			$(statusContainter).removeClass("active");
			$(statusText).removeClass("active");  
			$(statusText).html('');  
		}, 500); 
	}
	
	function showLoading(){  
		$(statusContainter).addClass("active");  
		$(statusLoader).addClass("active");  
	}
	
	function hideLoading(){ 
		$(statusContainter).removeClass("active");  
		$(statusLoader).removeClass("active"); 
	}
	
	function showErrorMessage(errorMessage){ 
		statusMsg(errorMessage, "danger"); 
	}
	
	// POPUP FORMS 
	
	function sendActionForm(e){  
		if(CanSendAjax == false) {return false;}   
		e.preventDefault();   
		
		let $form          = $(this), 
		    data           = $form.serializeObject();   
			data["id"]     = OBJ.ITEM_ID;   
			data["hash"]   = hash;  
		
		if(validateActionForm($form)){ 
			
			if(data["name"]){  
				data["name"]   = ENCRYPT(data["name"]);  
			}  
			
			formStatusLoading($form);   
			
			AJAX(ajaxURL, data, "json").then(function(res){  
				if(res["status"] == "ok"){ 
					controllerApp(res); 
					formStatusSuccess($form);  
				} else {
					formStatusError($form);  
					showErrorMessage("Server Error!");
				}
			}).fail(function(){
				formStatusError($form); 
				showErrorMessage("Server Error!"); 
			});
		}
	} 
	
	// CONTROLLER APP 
	
	function controllerApp(res){  
		if(res["cmd"] == "save")  { controllerSave(res)    }
		if(res["cmd"] == "edit")  { controllerEdit(res);   }
		if(res["cmd"] == "add")   { controllerAdd(res);    }
		if(res["cmd"] == "delete"){ controllerDelete(res); } 
	} 
	
	function controllerAdd(res){ 
		// First Level Reload 
		if(OBJ.ITEM_ID == 0){
			
			AJAX(ajaxURL, {"cmd":"list", "hash": hash}) 
			.then(function(resultList){ 
				resetNote(); 
				clearAllData();  
				loadCols(resultList, loadFirstLevel);  
				statusMsg("New Note Added", "success"); 
			}).fail(function(){ 
				showErrorMessage("Server Error!"); 
			}); 
			
		} else {
			ID_NEW = res["last_id"]; 
			clickItem(res["id"]); // reload parent 
		}
	}
	
	function clickItem(note_id){
		$(item_elem).filter(function(index){
			if( $(this).attr("data-id") == note_id){
				return this;  
			} 
		}).trigger("click"); 
	}
	
	function controllerDelete(res){ 
		 
		if(res["parent_id"] == 0){ 
			
			AJAX(ajaxURL, {"cmd":"list", "hash": hash}) 
			.then(function(resultList){ 
				resetNote(); 
				clearAllData();  
				loadCols(resultList, loadFirstLevel);  
				statusMsg("Note Deleted", "success");  
			}).fail(function(){ 
				showErrorMessage("Server Error!"); 
			}); 
			
		} else { 
			clickItem(res["parent_id"]); // reload parent 
		} 
		
		hideLoading(); 
	}
	
	function controllerEdit(res){
		OBJ = { "ITEM_ID":res["id"], "ITEM_NAME":DECRYPT(res["name"]) }; 
		$(item_elem).filter(function(index) { 
			if( $(this).attr("data-id") == OBJ.ITEM_ID ){ return this; }
		}).html(OBJ["ITEM_NAME"]);	
		setEditorLangByName(OBJ.ITEM_NAME);  
		statusMsg("Note Renamed!", "success");  
	}
	
	function controllerSave(res){
		statusMsg("Note Saved!", "success"); 
	}
	
	function validateActionForm($form){ 
		let noerrors       = true;
		let validateFields = "[data-required]"; // Селектор для требуемых валидации полей 
		$(validateFields, $form).each(function(){
			if ($.trim($(this).val()) == '') {				
				$(this).addClass("error"); // Сообщение об ошибке для текущего поля  
				noerrors = false;
			} else {
				$(this).removeClass("error"); // Отключение ошибки 
			}
		});
		return noerrors;
	}	
	
	function formStatusError($form){
		$form.find(".form_status").removeClass("active");
		$form.find(".status_error").addClass("active");
	}
	
	function formStatusLoading($form){
		$form.find(".form_status").removeClass("active");
		$form.find(".status_loading").addClass("active");
	}
	
	function formStatusSuccess($form){
		let cmd = $form.find('input[name="cmd"]').val();  
		$form.find('input[type="text"]').val("");  
		$.fancybox.close(); 
		$form.find(".form_status").removeClass("active");
		$form.find(".status_success").addClass("active"); 
	}
	
	// TREE EDITOR 
	
	function loadTreeMenu() {
		
	   // https://www.jstree.com/demo_filebrowser/index.php  
	   $('#tree_menu').jstree({ 
			'core' : { 
				'data' : { 
					'url': ajaxURL, 
					'data': function(node){ 
						return {'cmd':'get_node', 'id':node.id, 'hash':hash};  
					}, 
					'success': function(nodes) {
					   let dencodeText = function(node){   
						   node.text = DECRYPT(node.text); 	
					   };
					   for (let i = 0; i < nodes.length; i++) {
						   dencodeText(nodes[i]);
					   } 
					   hideLoading(); 
				   }
				},
				'check_callback': true, 
				'themes' : { 'responsive' : false, 'variant' : 'small', 'stripes' : true }
			},  
			'types' : {
				'default' : { 'icon' : 'folder' },
				'file' : { 'valid_children' : [], 'icon' : 'file' }
			},
			'plugins' : ['state','dnd','sort','types']
		})
		.on('move_node.jstree', moveNodeTree);  
	}
	
	function moveNodeTree(e, data) {
		
		let dataTo = {
		   'cmd':        'move_node', 
		   'id' :        data.node.id, 
		   'parent_id' : data.parent, 
		   'hash':       hash
		}; 
			
		AJAX(ajaxURL, dataTo).then(function(resultTree){ 
			
			data.instance.refresh(); 
			
			if(resultTree["status"] == "error"){ 
				alert("Error Move Node!"); 
			} 
			
			// Reset Menu List 
			AJAX(ajaxURL, {"cmd":"list", "hash": hash}) 
			.then(function(resultList){ 
				resetNote(); 
				clearAllData();  
				loadCols(resultList, loadFirstLevel);  
				hideLoading(); 
			}).fail(function(){ 
				showErrorMessage("Server Error!"); 
			}); 
			
		}).fail(function(){
			alert("Error Move Node!"); 
			data.instance.refresh();
		});  
			 
	}
	
	function adaptiveDesign(){ 
		if( $(this).width() < mobileWidth) { 
			$(main_columns).addClass("mobile"); 
		} else {
			$(main_columns).removeClass("mobile");
		} 
	}
	
	// ACE EDITOR 
	
	function EditorInit(){  
		let styleObj = { 
			fontFamily: "Cousine", 
			fontSize: "13.5px", 
			tabSize: 2
		};  
		editor.setOptions(styleObj);
		editor.renderer.setScrollMargin(10, 10); 
		editor.getSession().setUseWrapMode(true); //wrap mode 
		editor.setOptions({ maxLines: Infinity }); 
	} 
	
	function clearEditorData(){ 
		editor.getSession().setValue(""); 
		EditorSetLang("text"); 
	}
	
	function getEditorData(){ 
	    return editor.getSession().getValue(); 
	}
	
	function setEditorData(text){ 
		editor.getSession().setValue(text);  
		setEditorLangByName(OBJ.ITEM_NAME); 
	} 
	
	function setEditorLangByName(name){
		
		EditorSetLang("text"); // Default 
		
		// use underscore.strings.js
		if(_.endsWith(name, ".html")){
			EditorSetLang("php"); 
		}
		if(_.endsWith(name, ".php")){
			EditorSetLang("php"); 
		}
		if(_.endsWith(name, ".js")){ 
			EditorSetLang("javascript"); 
		}
		if(_.endsWith(name, ".cs")){ 
			EditorSetLang("csharp"); 
		}
	}
	
	function EditorSetLang(lang){
		// defaults 
		editor.setTheme("ace/theme/eclipse"); 
		editor.getSession().setMode("ace/mode/text");
		
		// select languages 
		if(lang == "php" || lang == "html" ){
			editor.setTheme("ace/theme/cobalt"); // dreamweaver - light
		} 
		if(lang == "javascript"){
			editor.setTheme("ace/theme/cobalt"); 
		}
		if(lang == "text"){
			editor.setTheme("ace/theme/eclipse");  
		}
		if(lang == "csharp"){
			editor.setTheme("ace/theme/cobalt"); 
		}
		// set mode 
	    editor.getSession().setMode("ace/mode/"+lang); 
	}
	
	// VIM MODE 
	
	function toogleVim(){
		let $this = $(this);
		if($this.hasClass("active")){
			$this.removeClass("active");
			vimDeactivate();  
		} else {
			$this.addClass("active");
			vimActivate();
		}
	}
	
	function vimActivate(){
		editor.setKeyboardHandler("ace/keyboard/vim"); 
	}
	
	function vimDeactivate(){
		editor.setKeyboardHandler(false);   
	}
	
	// ENCODE/DECODE   
	
	function ENCRYPT(text){
		try {
			var encrypted   = CryptoJS.AES.encrypt(text, passVal);
			return "" + encrypted;   
		} catch (err) {
			statusMsg("Error Encoding!", "danger");  
			console.error("ERROR ENCODE: ", err);   
		}
	} 
	
	function DECRYPT(text){ 
		try { 
			var decrypted    = CryptoJS.AES.decrypt(text, passVal);
			var decryptedUTF = decrypted.toString(CryptoJS.enc.Utf8); 
			return decryptedUTF;
		} catch (err) {
			statusMsg("Error Decoding!", "danger");  
			console.error("ERROR DECODE: ", err); 
		}
	}
	
	function getPassHash(){ 
		var pass  = $.trim($(passBlock).val()); 
		return "" + CryptoJS.MD5(pass + passSalt);   
	}

	// 	TEST ENCTYPTION/DECRYPTION  
	
	/* 
	var encryptedText = ENCRYPT("test");  
	console.log("_DECRYPT: ", DECRYPT("U2FsdGVkX1+yR8JBVUtH+eYxruOCKPiyn85tVvhvNzE="));
	*/  
	
}); 

$.fn.serializeObject = function() {
	let o = {};
	let a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o; 
};

