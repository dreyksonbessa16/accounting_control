const express = require('express');
const router = express.Router();
const postgres = require('../database/connection').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signin', (req, res, next) => {

    postgres.connect((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT * FROM users WHERE email = $1;`,
            [req.body.email],
            (error, results) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                if (results.rowCount < 1) {
                    return res.status(401).send({ message: 'Falha na autenticação!' });
                } else {
                    bcrypt.compare(req.body.password, results.rows[0].password, (err, result) =>{
                        if (err) { return res.status(401).send({ message: 'Falha na autenticação!' }) }
                        if (result) { 
                            let token = jwt.sign({
                                id_user: results.rows[0].id,
                                email: results.rows[0].email
                            }, process.env.jwtKey, {
                                expiresIn: "1h"
                            });

                            return res.status(200).send({ message: 'Autenticação realizada com sucesso!', token: token}) 
                        }
                    })
                }
            }
        )
    })
});

module.exports = router;