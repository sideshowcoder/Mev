<?php

function rdns_start($job, $infile, $outfile, $tool_path)
{

  $in = realpath($infile);
  $out = realpath($outfile);
  // Build command to execute
  $toexec = $tool_path;
  $toexec .= ' -f ';
  $toexec .= ' -m rdns';
  $toexec .= ' -i '.$in;
  $toexec .= ' -o '.$out;
  $toexec .= ' $> /dev/null &';

  // Execute 
  exec($toexec);

  return TRUE;
}

/* End rdns helper */
