const jwt = require('jsonwebtoken')

const mid = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        const validToken = jwt.verify(token, 'projectOne')
        if (!validToken) {
            res.status(400).send({ status: false, msg: "user not found" })
        }
        req.body.tokenId = validToken._id
        next()
    } catch (error) {
        res.status(400).send({ status: false, msg: error })
    }
}
module.exports.mid = mid;