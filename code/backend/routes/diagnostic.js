var express = require('express');
var router = express.Router();

const { authenticateJWT } = require('../middleware/authorization'); 

router.post("/tokenTest", authenticateJWT, function (req, res) {
    res.status(200).send({
        success: true
    });
});

module.exports = router;