let Label = require('../models/Label');
let express = require('express');
let router = express.Router();

/* GET label listing */
router.get('/', (req, res) => {
    Label.find((err, labels) => {
        if (err) {
            console.log('error fetching labels');
            labels = [];
        }

        res.json(labels);
    })
});

/* POST label creation*/
router.post('/', (req, res) => {
    let label = new Label({
        name: req.body['name']
    });

    let error = label.validateSync();
    if (error != undefined) {
        return res.status(422).json({errors: error.message})
    }

    label
        .save()
        .then(label => res.json(label))
        .catch(error => res.status(422).send(error.errorMessage));
});

module.exports = router;