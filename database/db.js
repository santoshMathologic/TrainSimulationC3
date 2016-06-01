var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/locolink', function(error) {
    if (error) {
        console.log('Error in Connection', error);
    } else {
        console.log('Connection Successfully');
    }
});

