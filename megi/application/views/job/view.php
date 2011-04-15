<table>

<tr><td>Type</td><td><?php echo $job->type;?></td></tr>
<tr><td>Specification</td><td><?php echo $job->spec;?></td></tr>
<tr><td>Result</td><td><?php echo $job->result;?></td></tr>
<tr><td>Date added</td><td><?php echo $job->add_date;?></td></tr>
<tr><td>Date started</td><td><?php echo $job->start_date;?></td></tr>
<tr><td>Date completed</td><td><?php echo $job->end_date;?></td></tr>

</table>
<p><?php echo anchor("job/start/$job->id", 'Start this Job', 'title=start');?></p>


<?php echo anchor('job', 'Back', 'title=Back');?>

