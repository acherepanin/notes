<div class="form_container">
  <div class="form_title edit_title">Edit Note</div>
  <div class="form_wrap">
  <form method="post" action="#" class="action_form"> 
      <input type="hidden" name="cmd" value="edit"/> 
      <div class="form-group">
        <input type="text" name="name" value="<?=$_REQUEST["ITEM_NAME"]?>" class="form-control" placeholder="Name" autocomplete="off" data-required>
      </div> 
      <button type="submit" class="btn btn-info">Submit</button>
      <?include_once('inc_info.php');?>
  </form>
  </div>
</div>