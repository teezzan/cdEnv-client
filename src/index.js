let axios = require('axios');
let fs = require('fs');


let userdetails = {};
try {
    userdetails = require('../.data');
} catch {
    userdetails.token = '';
}

class CdEnv {
    token = "";
    env = {};
    server = "";
    constructor(server) {
        this.token = userdetails.token;
        if (server) {
            this.server = server + "/api";
        } else {
            this.server = process.env.CDENV_SERVER + "/api";
        }
        console.log("SERVER URL = " + this.server);
    }
    ready() {
        return new Promise((resolve, reject) => {
            if (userdetails.token) {
                let a = this.me();
                a.then(res => {
                    resolve(res)
                })
                    .catch(err => {
                        reject(err)
                    })


            } else {
                resolve(false)
            }
        })
    }
    fetch(api_key, env_name, server = null) {
        let out_server;
        if (server !== null) {
            out_server = server;
        }
        else {
            out_server = this.server;
        }
        if (api_key == '' || api_key == undefined || api_key == null) {
            console.log('error')
            throw new Error("Invalid Parameters");
        }
        if (env_name == '' || env_name == undefined || env_name == null) {
            console.log('error')
            throw new Error("Invalid Parameters");
        }
        if (out_server == '' || out_server == undefined || out_server == null) {
            console.log('error')
            throw new Error("Invalid Parameters");
        }
        axios.post(`${out_server}/api/env/env`, {
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
            } catch {
                return { error: "Check Internet Connection" }
            }

        }).catch((err) => {
            console.log("Check Your Network Connection.");
        })

    }
    register(email, password, username) {
        if (email == "" || password == "" || username == "") {
            return false
        } else {
            return axios.post(`${this.server}/users/register`, {
                user: {
                    password,
                    email,
                    username
                }
            }).then((resp) => {
                let user = resp.data.user;
                return user
            }).catch((err) => {
                console.log("Error. Something went wrong.");;
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
            return axios.post(`${this.server}/users/login`, {
                user: {
                    password,
                    email
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
                console.log("Check Your Network Connection and Be sure of your credentials.");;
                this.token = ""
                return null
            })
        }
    }
    logout() {
        fs.writeFileSync('./.data.json', "");
        this.token = "";
        return Promise.resolve(true);
    }
    getenv() {
        return axios.get(`${this.server}/env/userenvs`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        })
            .then((resp) => {
                this.env = resp.data.envs;
                return this.env;
            }).catch(err => {
                console.log("Check Your Network Connection and Be sure You are Logged in.");
                throw err
            })

    }
    deleteEnv(id) {
        return axios.delete(`${this.server}/env/${id}`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        })
            .then((resp) => {
                return true
            }).catch(err => {
                console.log("Check Your Network Connection and Be sure You are Logged in.");
                throw err
            })

    }
    getenvDecrypt() {
        return axios.get(`${this.server}/env/userenvs?decrypt=true`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        })
            .then((resp) => {
                this.env = resp.data.envs;
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
            return axios.post(`${this.server}/env`, { env: { title } }, {
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
            return axios.put(`${this.server}/env/updateEnv`, { env: { title, _id: id } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
                return resp.data
            }).catch(err => {
                console.log("Check Your Network Connection");
            })
        }
    }
    createToken() {
        return axios.get(`${this.server}/users/genkey`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        }).then((resp) => {
            return resp.data
        }).catch(err => {
            console.log("Check Your Network Connection and Be sure You are Logged in.");
        })
    }
    me() {
        return axios.get(`${this.server}/users/me`, {
            headers: { 'authorization': `Bearer ${this.token}` }
        }).then((resp) => {
            return resp.data.user
        }).catch(err => {
            console.log(err.code);
            if (err.code == 'ECONNREFUSED') {
                console.log("Check Your Network Connection");
                return err.code;
            }
            else if (err.response.status == 401) {
                console.log("Please Login ");
            }
        })
    }
    deleteToken(id) {
        return axios.post(`${this.server}/users/delkey`, { key_id: id }, {
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
            return axios.post(`${this.server}/env/addKey`, { env: { env_id, key_name, value } }, {
                headers: { 'authorization': `Bearer ${this.token}` }
            }).then((resp) => {
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
            return axios.put(`${this.server}/env/updateKey`, { env: { env_id, key_id, key_name, value } }, {
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
            return axios.post(`${this.server}/env/deleteKey`, { env: { env_id, key_id } }, {
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
