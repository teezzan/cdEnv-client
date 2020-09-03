var term = require('terminal-kit').terminal;
var cdenv = require('./index')
var current_env = {}
var current_env_id = {}

exports.login = async () => {


    term('Please enter your email: ');

    var input = await term.inputField().promise;

    term.green("\nYour name is '%s'\n", input);

    term('Please enter your password: ');

    var password = await term.inputField().promise;

    term.green("\nYour name is '%s'\n", password);
    cdenv.login(input, password);
    exports.menu();

}

exports.exit = async () => {
    term.brightBlack('About to exit...\n');
    term.grabInput(false);
    term.applicationKeypad(false);

    // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
    setTimeout(() => { process.exit(); }, 100);

}

exports.menu = async () => {
    term.green('cdEnv Main Menu.\n');
    let items;
    if (cdenv.token !== "") {
        items = [
            'a. Environments',
            'b. Tokens',
            'c. Keys',
            'c. Revoke Token',
            'd. Help',
            'e. Quit'

        ]
    } else {
        items = [
            'a. Environments',
            'b. Generate Token',
            'c. Revoke Token',
            'd. Help',
            'e. Quit',
            'f. Login',
            'g. Register',

        ]
    }


    term.singleColumnMenu(items, function (error, response) {
        term('\n').eraseLineAfter.green(
            "#%s selected: %s (%s,%s)\n",
            response.selectedIndex,
            response.selectedText,
            response.x,
            response.y
        );
        switch (response.selectedIndex) {
            case 5:
                exports.login()
                break;
            case 4:
                exports.terminate();
                break
            case 0:
                exports.env()
                break
            case 1:
                exports.token()
                break

            default:
                break;
        }

    })
}
exports.terminate = async () => {
    term.brightBlack('About to exit...\n');
    term.grabInput(false);
    term.applicationKeypad(false);

    // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
    setTimeout(() => { process.exit(); }, 100);
}
exports.getenv = async () => {
    let a = cdenv.getenv();
    a.then((x) => {
        // console.log('yaya = ', x);
        //render table here
        let env_names = [];
        let bigtemprow = []
        x.forEach(x => {
            env_names.push(x.title);
            let keys = x.keys;
            let temprow = []
            keys.forEach(key => {
                temprow.push([key.key_name, key.value])
            });
            bigtemprow.push(temprow);

        });
        // console.log(env_names);
        // console.log(bigtemprow);

        return { items: env_names, data: bigtemprow };
    }).then(({ items, data }) => {

        term.singleColumnMenu(items, function (error, response) {
            term('\n').eraseLineAfter.green(
                "#%s selected: %s (%s,%s)\n",
                response.selectedIndex,
                response.selectedText,
                response.x,
                response.y
            );
            //render table return to main menu
            term.table([["key name", "value"], ...data[response.selectedIndex]
            ], {
                hasBorder: true,
                contentHasMarkup: true,
                borderChars: 'lightRounded',
                borderAttr: { color: 'blue' },
                textAttr: { bgColor: 'default' },
                width: 60,
                fit: true   // Activate all expand/shrink + wordWrap
            }
            );
            exports.menu()

        })
    })

}
exports.env = async () => {
    let items = [
        'a. Create Environment',
        'b. View Environments',
        'c. Edit Environment Name',
        'd. Delete Environment',
        'e. Menu',
        'f. Quit',

    ]
    term.singleColumnMenu(items, function (error, response) {
        term('\n').eraseLineAfter.green(
            "#%s selected: %s (%s,%s)\n",
            response.selectedIndex,
            response.selectedText,
            response.x,
            response.y
        );
        switch (response.selectedIndex) {
            case 0:
                exports.create()
                break;
            case 1:
                exports.getenv();
                break
            case 2:
                exports.edit();
                break
            case 3:
                exports.menu();
                break
            case 4:
                exports.menu()
                break
            case 5:
                exports.terminate()
                break

            default:
                break;
        }

    })
}

exports.create = async () => {
    term('Please enter your environment Name: ');
    var name = await term.inputField().promise;
    let a = cdenv.create(name)

    a.then((res) => {
        term('\n').eraseLineAfter.green(`${name} Environment Created Successfully\n`);
        exports.menu()

    }).catch((err) => {
        throw err
    })
}
exports.edit = async () => {
    let a = cdenv.getenv();
    a.then((x) => {
        let env_names = [];
        let env_id = [];
        x.forEach(x => {
            env_names.push(x.title);
            env_id.push(x._id);

        });

        return { items: env_names, data: env_id };
    }).then(({ items, data }) => {

        term.singleColumnMenu(items, async function (error, response) {
            term('\n').eraseLineAfter.green(
                "#%s selected: %s (%s,%s)\n",
                response.selectedIndex,
                response.selectedText,
                response.x,
                response.y
            );
            term('Please enter New Name: ');

            var input = await term.inputField().promise;
            let a = cdenv.editenv(input, data[response.selectedIndex])
            a.then((res) => {
                term('\n').eraseLineAfter.green(`${input} Environment Updated Successfully\n`);
                exports.menu()

            }).catch((err) => {
                throw err
            })


        })
    })
}
exports.token = async () => {
    let items = [
        'a. Create Token',
        'b. View Tokens',
        'c. Revoke Token',
        'd. Menu',
        'e. Quit',

    ]
    term.singleColumnMenu(items, function (error, response) {
        term('\n').eraseLineAfter.green(
            "#%s selected: %s (%s,%s)\n",
            response.selectedIndex,
            response.selectedText,
            response.x,
            response.y
        );
        switch (response.selectedIndex) {
            case 0:
                exports.createToken()
                break;
            case 1:
                exports.getToken();
                break
            case 2:
                exports.deleteToken();
                break
            case 3:
                exports.menu();
                break
            case 4:
                exports.terminate()
                break

            default:
                break;
        }

    })
}
exports.createToken = async () => {
    term('Generating Token... ');
    let a = cdenv.createToken()
    a.then((res) => {
        term('\n').eraseLineAfter.green(`Token Generated Successfully\n`);
        term('\n').eraseLineAfter.green(`Token: ${res.apiKey}\n`);
        exports.token()
    })
        .catch(err => {
            throw err
        })
}
exports.getToken = async () => {
    let a = cdenv.me();
    a.then((user) => {
        let x = user.tokens;
        x.forEach(x => {
            term('\n').eraseLineAfter.green(`${x._id}\n`);
        });
        exports.token()

    }).catch(err => {
        throw err
    })
}