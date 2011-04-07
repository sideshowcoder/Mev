var Mev = require('../lib/mev'),
	RDNS = require('../lib/rdns');

// Create instance of RDNS to be used in Mev
var mmrdns = new RDNS('rdns');

// Create instance of Mev with rdns as measurement module
var mev = new Mev(mmrdns, __dirname + '/rdnsinput.lst', true);

// Mev
mev.start();

