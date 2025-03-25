const express = require('express');
const router = express.Router();

router.get('/' , (req , res ) => {
    res.json({msg:"Rest API work"})
});

// אני רוצה לייצא את הראטור לקונפיג ראוט
module.exports = router;