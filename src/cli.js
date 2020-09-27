/**
 * Register
 * Login
 * View Envs
 * Create new Env
 * Generate Token and store as .env.cdenv file
 * Add env Key and Value
 * Delete Env Key and Value
 * edit Env Key and Value
 */

let term = require('terminal-kit').terminal;
let helpers = require('./cli_functions')
let cdenv = require('./index')


term.on('key', (name, matches, data) => {

    if (matches.indexOf('CTRL_C') >= 0) {
        term.green('CTRL-C received...\n');
        helpers.terminate();
    }
    if (matches.indexOf('CTRL-G') >= 0) {
        term.green('CTRL-G received... Menu\n');
        helpers.menu();
    }

});


let start = cdenv.ready();
start.then((x) => {
    // console.log("X =>", x);
    if (x == "ECONNREFUSED") {
        return false
    }
    else {
        return true
    }
    // console.log("Logged in ... ")
}).catch((x) => {
    // console.log("X111 =>", x);
    return x
    //remove .data or refresh login
    // console.log('refreshing login with refresh token')
}).then((x) => {
    if (x) {
        helpers.menu()
    }
})
