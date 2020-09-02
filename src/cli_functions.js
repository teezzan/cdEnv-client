var term = require('terminal-kit').terminal;
var cdenv = require('./index')

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
            'b. Generate Token',
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
                exports.getenv()
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

