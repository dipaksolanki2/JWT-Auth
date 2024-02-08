const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
var cors = require('cors');
app.use(cors());  // without it can't access token in angular 

const secretKey = 'secretKey'

app.get('/', (req, res) => {
    res.json({
    message: 'DEMO JWT Authentication'
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'dipak',
        email: 'test@test.com'
    }
    jwt.sign({user}, secretKey, {expiresIn:'300s'}, (err, token) => {
        res.json({
            token
        })
    })
})

app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err) {
            res.send({result: 'Invalid Token'})
        }
        else {
            res.json({
                message: 'Profile Accessed',
                authData
            })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token = token
        next()
    }
    else {
        res.send({
            result: 'Token is not valid'
        })
    }
}

app.listen(3000, ()=>{
    console.log('app running on port 3000');
})