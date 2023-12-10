const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {

    if (typeof req.headers.authorization !== "undefined") {

        let token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {

            if (err) {
                console.error(err);
                return res.status(403).send({ error: 'Unauthorized Access' });
            }
            else {
                // change this according to jwt generation

                req.body.id = data.userId;
                req.body.role = data.role;
                req.body.email = data.email;
    
                next();
            }
        })

    } else {
        res.status(403).send({ error: 'Unauthorized Access' });

    }
} //End of checkForValidUserRoleUser