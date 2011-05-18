<?php
require_once(APPPATH . '/controllers/test/Toast.php');

class Job_tests extends Toast
{
	function __construct()
	{
		parent::__construct(__FILE__);
	}

	/**
	 * OPTIONAL; Anything in this function will be run before each test
	 * Good for doing cleanup: resetting sessions, renewing objects, etc.
	 */
	function _pre() {}

	/**
	 * OPTIONAL; Anything in this function will be run after each test
	 * I use it for setting $this->message = $this->My_model->getError();
	 */
	function _post() {}


	/* TESTS */

}

// End of file example_test.php */
// Location: ./system/application/controllers/test/example_test.php */