var Mev = require('../lib/mev'),
	Dummy = require('../lib/dummy');

// Create instance of RDNS to be used in Mev
var mmd = new Dummy('dummy');

// Create instance of Mev with dummy module
var mev = new Mev(mmd, __dirname + '/dummyin.lst', true);

// Start mev
mev.start();

// Use the trigger for done results
mev.on('done', function(res){
	console.log('trigger');
})