<div class="form_container">
  <div class="form_title add_title">Add Note</div>
  <div class="form_wrap">
  <form method="post" action="#" class="action_form"> 
      <input type="hidden" name="cmd" value="add"/>  
      <div class="form-group">
        <input type="text" name="name" class="form-control" placeholder="Name" autocomplete="off" data-required>
      </div>
      <button type="submit" class="btn btn-info">Submit</button>
      <?include_once('inc_info.php');?>
  </form>
  </div>
</div>