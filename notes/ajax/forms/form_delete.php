<div class="form_container">
  <div class="form_title delete_title">Delete Note</div>
  <div class="form_wrap">
  <form method="post" action="#" class="action_form"> 
      <input type="hidden" name="cmd" value="delete"/> 
      <div class="form-group">
        <div class="name_note"><?=$_REQUEST["ITEM_NAME"]?></div> 
      </div> 
      <button type="submit" class="btn btn-danger">Delete</button>
      <div class="btn btn-info close-fancy">Cancel</div>
      <?include_once('inc_info.php');?>
  </form>
  </div>
</div>