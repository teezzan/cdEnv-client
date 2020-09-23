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

var term = require('terminal-kit').terminal;
// var cdenv = require('./index')
let helpers = require('./cli_functions')



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

// let a = async () => {
//     let b = await helpers.menu()
//     console.log('a ', b)
// }
// a()

// console.log("token= ", helpers.ready());
var cdenv = require('./index')
let start = cdenv.ready();
start.then((x) => {
    console.log("logged in")
}).catch((x) => {
    console.log(x);
    //remove .data or refresh login
    console.log('refresing login')
}).then(() => {
    helpers.menu()
})
