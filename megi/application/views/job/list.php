<table id="jobtable">
<tr>
  <th>Type</th>
  <th>Name</th>
  <th>Queued</th>
  <th>Started</th> 
  <th>Delete</th>
</tr>
<?php $rowcolor = "b";?>
<?php foreach($jobs as $job):?>
<tr class=<?php echo "row".$rowcolor;?>>
  <?php $rowcolor == "b" ? $rowcolor = "w" : $rowcolor = "b"; ?>
  <td><?php echo $job->type;?></td>
  <td>
  <?php if($job->name): ?>
    <?php echo anchor("/job/view/$job->id", $job->name, 'title="View Job"');?>
  <?php else: ?>
    <?php echo anchor("/job/view/$job->id", 'Unnamed', 'title="View Job"');?>
  <?php endif;?>
  </td>
  <td><?php echo $job->add_date;?></td>
  <td><?php echo $job->start_date;?></td>
  <td>
  <?php echo form_open('job/delete');?>
  <?php echo form_hidden('id', $job->id);?>  
  <?php echo form_submit('delete', 'Delete');?>
  <?php echo form_close();?>  
  </td>
</tr>
<?php endforeach;?>
</table>

