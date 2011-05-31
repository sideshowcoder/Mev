<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Page extends CI_controller {
  
  function __construct()
  {
    parent::__construct();
  }
  
  function about()
  {
    $this->load->view('header');
    $this->load->view('nav');      
    $this->load->view('page/about');
    $this->load->view('footer');
  }
  
}

/* End of Pages Controller */