const jwt       = require('jsonwebtoken')
const bcrypt    = require('bcryptjs')
const db        = require('../../configs/db.config')
const config    = require('../../configs/config')

const User = db.user

exports.login = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(users => {
		if (!users) {
			return res.send({sucess: false, message:"Tài khoản không tồn tại"});
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, users.password)
		if (!passwordIsValid) {
			return res.send({success: false, message:"Mật khẩu không đúng"});
		}
		
		let JwtToken = jwt.sign({ id: users.id }, config.secret, {
		  	expiresIn: 86400 // token hết hạn sau 24 giờ
		});

		res.send({success : true, token: JwtToken})
		
	}).catch(err => {
		res.send({success: false, message: err})
	})
}

exports.register = (req, res) => {
	User.findOne({
        where: {
            username: req.body.username
        }
    }).then(checkUser => {
        if (!checkUser) {
            User.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            }).then(users => {
                let JwtToken = jwt.sign({ id: users.id }, config.secret, {
                    expiresIn: 86400 // token hết hạn sau 24 giờ
                })
                res.send({success: true, token: JwtToken})
            }).catch(err => {
                res.send({success: false, message: err})
            })
        } else {
            return res.send({success: false, message: 'Tài khoản đã tồn tại!'})
        }
    }).catch(err => {
        res.send({success: false, message: err})
    })
}