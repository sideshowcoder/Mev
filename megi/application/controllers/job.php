<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Job extends CI_controller {
  
  // Overwrite contructor
  function __construct(){
    parent::__construct();
    //load libary
    $this->load->library('tank_auth');
    //load model
    $this->load->model('job/job_model', 'jobs', TRUE);
    //load ci helpers
    $this->load->helper(array('form', 'url'));
    //load project helpers
    $this->load->helper(array('rdns'));
  }

  // Index Page for Jobs Listing all Jobs by the user
  function index(){

    // Availibel Jobs for the current user
    $data['jobs'] = $this->jobs->get_for_current_user();

    // Possible job types
    $data['types'] = array('rdns' => 'RDNS');

    // Create page
    $this->load->view('header');
    $this->load->view('job/_form', $data);
    $this->load->view('job/list', $data);
    $this->load->view('footer');
  }

  // Create a Job
  function create(){
    $this->jobs->create();
    redirect('job');    
  }

  // View a Job by ID
  function view($id){
    // Get requested job and only show if it belongs to the user
    $job = $this->jobs->find($id);
    if($job->user_id == $this->tank_auth->get_user_id()){
      $data['job'] = $job;
    } else {
      redirect('job');
    }

    //Create page
    $this->load->view('header');
    $this->load->view('job/view', $data);
    $this->load->view('footer');
  }

  // Start a job
  function start($id){
   echo 'Started'; 
  }


}
/* End Job Controller */
