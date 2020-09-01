let axios = require('axios');
let server = 'http://localhost:3000/api/env/env'

class CdEnv {

    fetch(api_key, env_name) {
        if (api_key == '' || env_name == '') {
            console.log('error')
            return "error"
        } else {

            let out = false;
            axios.post(server, {
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
}

module.exports = new CdEnv();
