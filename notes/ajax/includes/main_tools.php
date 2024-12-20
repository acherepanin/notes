<div class="main_tools_wrap">
 <?
 $btnTools = [
   ["ID"=>"btn_add",       "SVG_ID"=>"plus",      "TEXT"=>"ADD"], 
   ["ID"=>"btn_save",      "SVG_ID"=>"upload",    "TEXT"=>"SAVE"], 
   ["ID"=>"btn_edit",      "SVG_ID"=>"pencil",    "TEXT"=>"EDIT NOTE"], 
   ["ID"=>"btn_edit_menu", "SVG_ID"=>"diagram-3", "TEXT"=>"EDIT MENU"], 
   ["ID"=>"btn_delete",    "SVG_ID"=>"x",         "TEXT"=>"DELETE"], 
 ];
 ?>
 <?foreach($btnTools as $btnItem):?>
  <div class="btn_tools <?=$btnItem["ID"]?>" id="<?=$btnItem["ID"]?>">
    <div class="icon_tools">
        <svg class="s_icon" fill="currentColor"> 
        <use xlink:href="img/bootstrap-icons.svg#<?=$btnItem["SVG_ID"]?>"/>
    </svg>
    </div>
    <div class="btn_text"><?=$btnItem["TEXT"]?></div>
  </div>
 <?endforeach;?>
 
 <div class="btn_hotkey_outer"> 
   <div class="btn_hotkey" id="btn_hotkey">hotkeys</div>  
 </div>
 
 <div class="btn_vim_outer"> 
   <div class="btn_vim" id="btn_vim">vim</div> 
 </div>
 
</div>


