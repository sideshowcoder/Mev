<table>
<tr>
  <th>Type</th>
  <th>Name</th>
  <th>Queued</th>
  <th>Started</th> 
  <th>View</th>
  <th>Delete</th>
</tr>
<?php foreach($jobs as $job):?>
<tr>
  <td><?php echo $job->type;?></td>
  <td>
  <?php if($job->name): ?>
    <?php echo $job->name;?>
  <?php else: ?>
    NA
  <?php endif;?>
  </td>
  <td><?php echo $job->add_date;?></td>
  <td><?php echo $job->start_date;?></td>
  <td><?php echo anchor("/job/view/$job->id", 'View', 'title="View Job"');?></td>
  <td>
  <?php echo form_open('job/delete');?>
  <?php echo form_hidden('id', $job->id);?>  
  <?php echo form_submit('delete', 'Delete');?>
  <?php echo form_close();?>  
  </td>
</tr>
<?php endforeach;?>
</table>

