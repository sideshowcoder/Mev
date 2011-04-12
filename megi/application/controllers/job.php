<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Job extends CI_controller {
  
  // Overwrite contructor
  function __construct(){
		parent::__construct();
    //load model
    $this->load->model('job/job_model', 'jobs', TRUE);
    //load helpers
		$this->load->helper(array('form', 'url'));
  }

  // Index Page for Jobs Listing all Jobs by the user
  function index(){

    // Availibel Jobs for the current user
    $data['jobs'] = $this->jobs->user_jobs();

    // Possible job types
    $data['types'] = array('rdns' => 'RDNS');

    // Create a new Job form
    $this->load->view('header');
    $this->load->view('job/create_form', $data);
    $this->load->view('job/list', $data);
    $this->load->view('header');


  }

  // Create a Job
  function create(){
    $this->jobs->create();
    redirect('job');    
  }

  // View a Job by ID
  function view(){
    echo 'View job';
  }

  // 

}
/* End Job Controller */
