var dnsext = require('../lib/dnsext');	
var c0 = dnsext.initChannelWithNs();

var c1 = dnsext.initChannelWithNs('8.8.4.4');
dnsext.getHostByName(c1, 'yahoo.de', function(err, domains){
	if(err) console.log(err);
	console.log(domains);
});

var c2 = dnsext.initChannelWithNs('8.8.8.8');
dnsext.getHostByName(c2, 'google.de', function(err, domains){
	if(err) console.log(err);
	console.log(domains);
});

dnsext.getHostByName(c0, 'facebook.com', function(err, domains){
	if(err) console.log(err);
	console.log(domains);
});

var c4;
dnsext.getHostByName(c0, 'ns1.yahoo.com', function(err, domains){
	if(err) console.log(err);
	c4 = dnsext.initChannelWithNs(domains[0]);
		dnsext.getHostByName(c4, 'ns3.yahoo.com', function(err, domains){
			if(err) console.log(err);
			console.log(domains);
		});
});
