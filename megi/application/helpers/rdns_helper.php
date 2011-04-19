<?php

function rdns_start($job, $infile, $outfile, $tool_path)
{

  $in = realpath($infile);
  $out = realpath($outfile);
  // Build command to execute
  $toexec = $tool_path;
  $toexec .= ' -m rdns';
  $toexec .= ' -r '.$in;
  $toexec .= ' -o '.$out;
  $toexec .= ' $> /dev/null &';

  // Execute 
  exec($toexec);

  return TRUE;
}

function rdns_result($job)
{
  return TRUE;
}

/* End rdns helper */
