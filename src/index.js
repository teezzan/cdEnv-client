let axios = require('axios');
let fs = require('fs');
let server = 'http://localhost:3000/api';
var term = require('terminal-kit').terminal;


let userdetails = {};
try {
    userdetails = require('../.data');
} catch{
    userdetails.token = '';
}

class CdEnv {
    token = "";
    env = {};

    constructor() {
        this.token = userdetails.token;
    }
    ready() {
        return new Promise((resolve, reject) => {
            if (userdetails.token) {
                let a = this.me();
                a.then(res => {
                    resolve(true)
                })
                    .catch(err => {
                        console.log(err);
                        reject(err)
                    })


            }
        })
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
                console.log("Check Your Network Connection and Be sure You are Logged in.");
            })
        }
    }
    register(email, password, username) {
        if (email == "" || password == "" || username == "") {
            return false
        } else {
            return axios.post(`${server}/users/register`, {
                user: {
                    password,
                    email,
                    username
                }
            }).then((resp) => {
                let user = resp.data.user;
                fs.writeFileSync('./.data.json', "")
                return user
                // console.log(userdata)
            }).catch((err) => {
                console.log("Check Your Network Connection and Be sure You are Logged in.");;
                this.token = ""
                fs.writeFileSync('./.data.json', "")
                throw err

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
                console.log("Check Your Network Connection and Be sure You are Logged in.");;
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
                console.log("Check Your Network Connection and Be sure You are Logged in.");
                throw err
            })

    }
    create(title) {
        if (title == "") {
            return false
        } else {
            return axios.post(`${server}/env`, { env: { title } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                // console.log(resp.data);
                return resp.data
            }).catch(err => {
                throw err
            })
        }
    }
    editenv(title, id) {
        if (title == "" || id == "") {
            return false
        } else {
            return axios.put(`${server}/env/updateEnv`, { env: { title, _id: id } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                return resp.data
            }).catch(err => {
                console.log("Check Your Network Connection");
            })
        }
    }
    createToken() {
        return axios.get(`${server}/users/genkey`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        }).then((resp) => {
            return resp.data
        }).catch(err => {
            console.log("Check Your Network Connection and Be sure You are Logged in.");
        })
    }
    me() {
        return axios.get(`${server}/users/me`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        }).then((resp) => {
            return resp.data.user
        }).catch(err => {
            // 

            console.log(err.code);
            if (err.code == 'ECONNREFUSED') {
                console.log("Check Your Network Connection");
            }
            else if (err.response.status == 401) {
                console.log("Please Login ");
            }
        })
    }
    deleteToken(id) {
        return axios.post(`${server}/users/delkey`, { key_id: id }, {
            headers: { 'authorization': `Bearer ${this.token}` }
        }
        ).then((resp) => {
            return resp.data.user
        }).catch((err) => {
            throw err
        })
    }
    addKey(env_id, key_name, value) {
        if (env_id == "" || key_name == "" || value == "") {
            return false
        } else {
            return axios.post(`${server}/env/addKey`, { env: { env_id, key_name, value } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                // console.log(resp.data);
                return resp.data.env
            }).catch(err => {
                throw err
            })
        }
    }
    editKey(env_id, key_id, key_name, value) {
        if (env_id == "" || key_id == "" || key_name == "" || value == "") {
            return false
        } else {
            return axios.put(`${server}/env/updateKey`, { env: { env_id, key_id, key_name, value } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                return resp.data.env
            }).catch(err => {
                throw err
            })
        }
    }
    deleteKey(env_id, key_id) {
        if (env_id == "" || key_id == "") {
            return false
        } else {
            return axios.post(`${server}/env/deleteKey`, { env: { env_id, key_id } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                return resp.data.env
            }).catch(err => {
                throw err
            })
        }
    }
}

module.exports = new CdEnv();
