let express = require('express');
let router = express.Router();

const { authenticateJWT } = require('../middleware/authorization'); 

router.post("/tokenTest", authenticateJWT, function (req, res) {
    if (res.statusCode != 200) return;  // If the middleware didn't authenticate the user, return

    res.status(200).send({
        success: true,
        username: req.user.username,
    });
});

module.exports = router;