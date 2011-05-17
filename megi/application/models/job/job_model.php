<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Job_model extends CI_Model {

  // Model Data
  var $type = '';
  var $name = '';
  var $spec = '';
  var $add_date = '';
  var $start_date = '';
  var $user_id = '';

  // Overwrite contructor to load helpers
  public function __construct()
  {
    parent::__construct();
    $this->load->library('tank_auth');
    $this->load->helper('date');
  }

  // Create a new job in the DB
  function create()
  {
    $this->type = $this->input->post('jobtype');
    $this->spec = $this->input->post('jobspec');
    $this->name = $this->input->post('jobname');
    $this->add_date = date('Y-m-d H:i:s');
    $this->user_id = $this->tank_auth->get_user_id();

    // insert in db
    $this->db->insert('jobs', $this);
    return $this;
  }

  // Get the jobs for user
  function get_for_current_user()
  {
    $query = $this->db->get_where('jobs', array('user_id' => $this->tank_auth->get_user_id()));
    return $query->result();
  }

  function find($id)
  {
    $query = $this->db->get_where('jobs', array('id' => $id), 1);
    return $query->row();
  }

  //find job and check if it belongs to the current user
  function find_for_user($id)
  {
    $query = $this->db->get_where('jobs', array('id' => $id, 'user_id' => $this->tank_auth->get_user_id()), 1);
    return $query->row();
  }

  function set_start_date($id)
  {
    $this->db->update('jobs', array('start_date' => date('Y-m-d H:i:s')), array('id' => $id));
  }

}

/* End Jobmodel */
