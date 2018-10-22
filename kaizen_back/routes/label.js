let Label = require('../models/Label');
let express = require('express');
let router = express.Router();

/* GET label listing */
router.get('/', (req, res) => {
    res.send('the listing');
});

/* POST label creation*/
router.post('/', (req, res) => {

});

module.exports = router;