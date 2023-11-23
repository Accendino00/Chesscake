var express = require('express');
var router = express.Router();

const { authenticateJWT } = require('../middleware/authorization'); 

router.post("/tokenTest", authenticateJWT, function (req, res) {
    console.log("Sono qui, con questa res status:" + res.statusCode);
    if (res.statusCode != 200) return;  // If the middleware didn't authenticate the user, return

    res.status(200).send({
        success: true
    });
});

module.exports = router;