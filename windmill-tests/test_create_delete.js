var test_create_delete = new function() {
    this.test_actions = [
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"link": "New", "timeout": "8000"}, "method": "waits.forElement"},
{"params": {"link": "New"}, "method": "click"},
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"timeout": "8000", "name": "jobname"}, "method": "waits.forElement"},
{"params": {"name": "jobname"}, "method": "click"},
{"params": {"text": "test", "name": "jobname"}, "method": "type"},
{"params": {"text": "131.159.20", "name": "jobspec"}, "method": "type"},
{"params": {"name": "submit"}, "method": "click"},
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"link": "Show Specification"}, "method": "click"},
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"string": "131.159.20"}, "method": "asserts.assertNode"},
{"params": {"link": "Home"}, "method": "click"},
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"timeout": "8000", "name": "delete"}, "method": "waits.forElement"},
{"params": {"name": "delete"}, "method": "click"},
{"params": {"timeout": "20000"}, "method": "waits.forPageLoad"},
{"params": {"string": "Job deleted successfully"}, "method": "asserts.assertNode"}
    ];
}


