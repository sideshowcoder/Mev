<table>
<tr>
  <th>Type</th>
  <th>Queued</th>
  <th>Started</th> 
  <th>Result</th>
  <th>View</th>
</tr>
<?php foreach($jobs as $job):?>
<tr>
  <td><?php echo $job->type;?></td>
  <td><?php echo $job->add_date;?></td>
  <td><?php echo $job->start_date;?></td>
  <td><?php if($job->result != ""): ?></td>
        <?php echo $job->result;?>
      <?php else: ?>
        NA
      <?php endif;?>
  </td>  
    <td><?php echo anchor("/job/view/$job->id", 'View', 'title="View Job"');?></td>
</tr>
<?php endforeach;?>
</table>

