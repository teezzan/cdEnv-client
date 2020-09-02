let axios = require('axios');
let fs = require('fs');
let server = 'http://localhost:3000/api';
let userdetails = require('../.data')

class CdEnv {
    token = "";
    env = {};

    constructor() {
        if (userdetails.token) {
            this.token = userdetails.token;
        }
    }
    fetch(api_key, env_name) {
        if (api_key == '' || env_name == '') {
            console.log('error')
            return "error"
        } else {

            let out = false;
            axios.post(`${server}/env/env`, {
                env_name: env_name,
                api_key
            }
            ).then((resp) => {
                try {
                    let keys = resp.data.env.keys;
                    keys.forEach(x => {
                        process.env[x.key_name] = x.value
                    });
                    return keys
                } catch{
                    return { error: "Check Internet Connection" }
                }

            }).catch((err) => {
                console.log(err)
            })
        }
    }

    login(email, password) {
        if (email == "" || password == "") {
            return false
        } else {
            axios.post(`${server}/users/login`, {
                user: {
                    password: "password",
                    email: "email@gmail.com"
                }
            }).then((resp) => {
                let user = resp.data.user;
                let userdata = {
                    _id: user._id,
                    username: user.username,
                    token: user.token
                }
                this.token = user.token;
                fs.writeFileSync('./.data.json', JSON.stringify(userdata))
                // console.log(userdata)
            }).catch((err) => {
                console.log(err);
                this.token = ""
                throw err

            })
        }
    }
    getenv() {
        return axios.get(`${server}/env/userenvs`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        })
            .then((resp) => {
                this.env = resp.data.env;
                return this.env
            }).catch(err => {
                console.log(err)
                throw err
            })

    }
}

module.exports = new CdEnv();
