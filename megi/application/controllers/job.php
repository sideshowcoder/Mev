<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Job extends CI_controller {
  
  function __construct()
  {
    parent::__construct();
    //load config
    $this->config->load('megi');
    //load libary
    $this->load->library('tank_auth');
    //load model
    $this->load->model('job/job_model', 'jobs', TRUE);
    //load ci helpers
    $this->load->helper(array('form', 'download'));
    //load project helpers
    $this->load->helper(array('rdns'));
  }
  
  /*
   * Serve Data as JSON or HTML depending on the request
   */
  private function _serve_with_templates($data, $templates, $match = '.json')
  {
    // If no data is passed we want to redirect home because there is something wrong
    if(is_null($data))
    {
      redirect('/');
    }
    elseif(strstr(current_url(), $match))
    {
      $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode($data));
    }
    else
    {
      $this->load->view('header');
      // Add flash if there is something there
      if(isset($data['flash']))
      {
        $this->load->view('flash', $data);
      }
      foreach($templates as $template)
      {
        $this->load->view($template, $data);
      }
      $this->load->view('footer');
    }
  }

  /* 
   * Index Page for Jobs Listing all Jobs by the current user
   * GET
   * JSON: http://megi.local/index.php/job/index/all.json
   * HTML: http://megi.local/index.php/job/index
   */
  function index()
  {
    $data['jobs'] = $this->jobs->get_for_current_user();
    $this->_serve_with_templates($data, array('job/list'), 'all.json');
  }

  /* 
   * Form to create a new Job 
   * GET
   * JSON: http://megi.local/index.php/job/add
   * HTML: http://megi.local/index.php/job/add.json
   */
  function add()
  {
    $data['types'] = $this->config->item('modules');
    $this->_serve_with_templates($data, array('job/new'));
  }

  /*
   * Create a Job and redirect to view it
   * POST
   * JSON: http://megi.local/index.php/job/create.json
   * HTML: http://megi.local/index.php/job/create
   */
  function create()
  {
    $data['job'] = $this->jobs->create();
    $this->_serve_with_templates($data, array('job/view'));
  }

  /* 
   * View Job 
   * GET
   * JSON: http://megi.local/index.php/job/view/[:id]
   * HTML: http://megi.local/index.php/job/view/[:id].json
   */
  function view($id)
  {
    // Get requested job and only show if it belongs to the user
    $job = $this->jobs->find($id);
    if($job->user_id == $this->tank_auth->get_user_id())
    {
      $data['job'] = $job;
    } 
    $this->_serve_with_templates($data, array('job/view'));
  }

  /* 
   * Start a Job 
   * GET
   * JSON: http://megi.local/index.php/job/start/[:id]
   * HTML: http://megi.local/index.php/job/start/[:id].json
   */
  function start($id)
  {
    $job = $this->jobs->find_for_user($id);
    // Check if job belongs to current user
    if($job)
    {
      $data['job'] = $job;
      // Check if type is availible and run
      if(array_key_exists($job->type, $this->config->item('modules')))
      {
        // Handle files
        $specfile = $this->config->item('spec_path').'/'.$job->id.'.spec';
        $resfile = $this->config->item('result_path').'/'.$job->id.'.res';
        touch($resfile);
        chmod($resfile, 0666);
        $infile = fopen($specfile, 'w');
        fwrite($infile, $job->spec);
        fclose($infile);

        // Start Job via helper
        $start_func = $job->type.'_start';
        $tool_path = $this->config->item('tool_path');
        if($start_func($job, $specfile, $resfile, $tool_path))
        {
          $this->jobs->set_start_date($id);
          $data['flash'] = 'Job started';
        }
        else 
        {
          $data['flash'] = 'Job start failed';
        }
      } 
      else 
      {
        $data['flash'] = 'Module for job not available';
      }
    } 
    $this->_serve_with_templates($data, array('job/view'));
  }
  
  /* 
   * View Job Result
   * GET
   * JSON: http://megi.local/index.php/job/result/[:id]
   * HTML: http://megi.local/index.php/job/result/[:id].json
   */
  function result($id)
  {
    $job = $this->jobs->find_for_user($id);
    if($job && $job->start_date != '0000-00-00 00:00:00')
    {
      $data['job'] = $job;
      $result = file_get_contents($this->config->item('result_path').'/'.$job->id.'.res');
      $data['result'] = $result;
    }
    elseif($job)
    {
      $data['job'] = $job;
      $data['result'] = false;
    }
    $this->_serve_with_templates($data, array('job/result'));
  }

  
  /* 
   * View Job Specification
   * GET
   * JSON: http://megi.local/index.php/job/spec/[:id]
   * HTML: http://megi.local/index.php/job/spec/[:id].json
   */
  function spec($id)
  {
    $job = $this->jobs->find_for_user($id);
    if($job)
    {
      $data['job'] = $job;
      $data['spec'] = file_get_contents($this->config->item('spec_path').'/'.$job->id.'.spec');
    }
    $this->_serve_with_templates($data, array('job/spec'));
  }


}
/* End Job Controller */
