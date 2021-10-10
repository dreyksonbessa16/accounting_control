const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.jwtKey);
        req.user = decode;
        next();
    } catch (error) {

        return res.status(401).send({message: 'Falha na autenticação!', error: error})
    }
}

exports.opcional = (req, res, next) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.jwtKey);
        req.user = decode;
        next();
    } catch (error) {

        next();
    }
}
