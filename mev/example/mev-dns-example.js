var Mev = require('../lib/mev'),
	  RDNS = require('../lib/rdns');

// Create instance of RDNS to be used in Mev
var mmrdns = new RDNS('rdns');

// Create instance of Mev with rdns as measurement module and make write out to rdnsoutput file
var mev = new Mev(mmrdns, __dirname + '/rdnsinput.lst', __dirname + '/rdnsoutput.csv');

// Start the instance
mev.start();

