<?php
class Mev extends CI_Controller {


  // Constructor overwrite to load local helpers
  public function __construct()
  {
    parent::__construct();
    $this->load->helper('form');
  }

  // Mev Job Setup Page
  public function index()
  {
    $this->load->view('mev_main');
  }

  // Create a new job for Mev
  public function new_job()
  {
    echo 'Do something useful here instead';
  }



}
?>
