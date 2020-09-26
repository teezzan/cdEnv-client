var term = require('terminal-kit').terminal;
var cdenv = require('./index')

exports.menu = async () => {

    term.green('.\n');
    term.green('cdEnv Main Menu.\n');
    let items;
    if (cdenv.token !== "") {
        items = [
            'a. Environments',
            'b. Tokens',
            'c. Keys',
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


    return term.singleColumnMenu(items, function (error, response) {
        term('\n').eraseLineAfter.green(
            "#%s selected: %s (%s,%s)\n",
            response.selectedIndex,
            response.selectedText,
            response.x,
            response.y
        );
        let out;
        switch (response.selectedIndex) {

            case 0:
                exports.env();
                break
            case 1:
                exports.token()
                break
            case 2:
                exports.keys()
                break
            case 4:
                exports.terminate();
                break
            case 5:
                exports.login()
                break;
            case 6:
                exports.register()
                break;

            default:
                break;
        }

    })

}
exports.register = async () => {


    term('Please enter your email: ');

    var email = await term.inputField().promise;

    term.green("\nYour email is '%s'\n", email);

    term('Please choice of username: ');

    var username = await term.inputField().promise;

    term.green("\nYour username is '%s'\n", username);

    term('Please enter your password: ');

    var password = await term.inputField().promise;

    let a = cdenv.register(email, password, username);
    a.then(res => {

        term.green(`Check your Email (${email}) for a Confirmation Link\n`);
    }).catch(err => {
        term.red(`${err.message}\n`)
    })
    exports.menu();

}
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
    setTimeout(() => {
        clear();
        process.exit();
    }, 100);

}


exports.terminate = async () => {
    term.brightBlack('About to exit...\n');
    term.grabInput(false);
    term.applicationKeypad(false);

    // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
    setTimeout(() => { process.exit(); }, 100);
}
exports.env = async () => {
    term('\n').eraseLineAfter.green(` Environment SubMenu\n\n`);

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
                exports.createEnv()
                break;
            case 1:
                exports.getEnv();
                break
            case 2:
                exports.editEnv();
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
exports.createEnv = async () => {
    term('Please enter your environment Name: ');
    var name = await term.inputField().promise;
    let a = cdenv.create(name)

    a.then((res) => {
        term('\n').eraseLineAfter.green(`${name} Environment Created Successfully\n`);
        exports.menu()

    }).catch((err) => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}
exports.editEnv = async () => {
    let a = cdenv.getenv();
    a.then((x) => {
        let env_names = [];
        let env_id = [];
        console.log("here1")
        x.forEach(x => {
            env_names.push(x.title);
            env_id.push(x._id);

        });
        console.log("here2")

        return { items: env_names, data: env_id };
    }).then(({ items, data }) => {
        console.log("here3")

        if (items.length !== 0) {
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
                    if (res) {
                        term('\n').eraseLineAfter.green(`${input} Environment Updated Successfully\n`);
                    }
                    exports.menu()

                }).catch((err) => {
                    console.log("Check Your Network Connection And Be Sure You are Logged in");
                    exports.menu();
                })


            })
        } else {
            term.red('Empty\n');
            exports.env();
        }
    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}
exports.getEnv = async () => {
    let a = cdenv.getenv();
    a.then((x) => {
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

        return { items: env_names, data: bigtemprow };
    }).then(({ items, data }) => {
        if (items.length !== 0) {
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
        }
        else {
            term.red('Empty\n');
            exports.env();
        }
    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })

}
exports.token = async () => {
    term('\n').eraseLineAfter.green(` Token SubMenu\n\n`);

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
        if (res) {

            term('\n').eraseLineAfter.green(`Token Generated Successfully\n`);
            term('\n').eraseLineAfter.green(`Token: ${res.apiKey}\n`);
        }
        exports.token()
    })
        .catch(err => {
            console.log("Check Your Network Connection And Be Sure You are Logged in");
            exports.menu();
        })
}
exports.getToken = async () => {
    let a = cdenv.me();
    a.then((user) => {
        let x = user.tokens;
        x.forEach(x => {
            term('\n').eraseLineAfter.green(`${x.key}\n`);
        });
        exports.token()

    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}
exports.deleteToken = async () => {
    let a = cdenv.me();
    a.then((user) => {
        let x = user.tokens;
        let token = [];
        let token_id = [];
        x.forEach(x => {
            token.push(x.key);
            token_id.push(x._id);
        });
        return { token, token_id }

    })
        .then(({ token, token_id }) => {
            if (token.length !== 0) {
                term.singleColumnMenu(token, function (error, response) {
                    term('\n').eraseLineAfter.green(
                        "#%s selected: %s (%s,%s)\n",
                        response.selectedIndex,
                        response.selectedText,
                        response.x,
                        response.y
                    );
                    console.log(token_id);
                    a = cdenv.deleteToken(token_id[response.selectedIndex])
                    a.then((res) => {
                        if (res) {
                            term('\n').eraseLineAfter.red(`Revoked Successfully\n`);
                        }
                        exports.token()

                    }).catch(err => {
                        console.log("Check Your Network Connection And Be Sure You are Logged in");
                        exports.menu();
                    })
                })
            } else {
                term('\n').eraseLineAfter.red(`Empty\n`);
                exports.token()
            }

        })
        .catch(err => {
            console.log("Check Your Network Connection And Be Sure You are Logged in");
            exports.menu();
        })
}
exports.keys = async () => {
    term('\n').eraseLineAfter.green(` Key SubMenu\n\n`);

    let items = [
        'a. Add New Env Key ',
        'b. Edit Env Key',
        'b. Delete Env Key',
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
                exports.addKey()
                break;
            case 1:
                exports.editKey();
                break
            case 2:
                exports.deleteKey();
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
exports.addKey = async () => {
    //list environments
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
        if (items.length !== 0) {
            term.singleColumnMenu(items, async function (error, response) {
                term('\n').eraseLineAfter.green(
                    "#%s selected: %s (%s,%s)\n",
                    response.selectedIndex,
                    response.selectedText,
                    response.x,
                    response.y
                );
                term('\nPlease enter Key_Name: ');

                var key_name = await term.inputField().promise;

                term('\nPlease enter Value: ');

                var value = await term.inputField().promise;

                let a = await cdenv.addKey(data[response.selectedIndex], key_name, value);
                term('\n').eraseLineAfter.green(`${key_name} added Successfully\n`);
                exports.menu()

            })
        } else {
            term.red('Empty\n');
            exports.keys();
        }

    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}
exports.editKey = async () => {
    //list environments
    let a = cdenv.getenv();
    a.then((x) => {
        let env_names = [];
        let env_id = [];
        let keys = []
        x.forEach(x => {
            env_names.push(x.title);
            env_id.push(x._id);
            keys.push(x.keys);

        });

        return { items: env_names, env_id: env_id, keys };
    }).then(({ items, env_id, keys }) => {
        // console.log(items)
        if (items.length !== 0) {
            let ab = term.singleColumnMenu(items).promise
            ab.then((res) => {
                console.log(res)
                return res
            })
                .then((response) => {
                    keys = keys[response.selectedIndex];
                    let key_names = []
                    keys.forEach(key => {
                        key_names.push(key.key_name)
                    });
                    return { keys, key_names, response }

                }).then(({ keys, key_names, response }) => {
                    if (key_names.length !== 0) {

                        let b = term.singleColumnMenu(key_names).promise
                        b.then(async (res2) => {
                            term('\n').eraseLineAfter.green(
                                "#%s selected: %s (%s,%s)\n\n",
                                res2.selectedIndex,
                                res2.selectedText,
                                res2.x,
                                res2.y
                            );
                            term('\nPlease enter New Key_Name (Press Return to Leave Unchanged): ');

                            var key_name = await term.inputField().promise;
                            if (key_name == "") {
                                key_name = keys[res2.selectedIndex].key_name
                            }

                            term('\nPlease enter New Value (Press Return to Leave Unchanged): ');

                            var value = await term.inputField().promise;
                            if (value == "") {
                                value = keys[res2.selectedIndex].value
                            }


                            let a = cdenv.editKey(env_id[response.selectedIndex], keys[res2.selectedIndex]._id, key_name, value);
                            a.then((res) => {
                                term('\n').eraseLineAfter.green(`${key_name} Updated Successfully\n`);
                                exports.keys()

                            }).catch((err) => {
                                console.log("Check Your Network Connection And Be Sure You are Logged in");
                                exports.menu();
                            })
                            // exports.keys();
                        })

                    } else {
                        term.red('Empty\n');
                        exports.keys();
                    }
                })

        } else {
            term.red('Empty\n');
            exports.keys();
        }
    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}
exports.deleteKey = async () => {
    //list environments
    let a = cdenv.getenv();
    a.then((x) => {
        let env_names = [];
        let env_id = [];
        let keys = []
        x.forEach(x => {
            env_names.push(x.title);
            env_id.push(x._id);
            keys.push(x.keys);

        });

        return { items: env_names, env_id: env_id, keys };
    }).then(({ items, env_id, keys }) => {
        if (items.length !== 0) {
            term.singleColumnMenu(items, async function (error, response) {
                term('\n\n\n').eraseLineAfter.green(
                    "#%s selected: %s (%s,%s)\n",
                    response.selectedIndex,
                    response.selectedText,
                    response.x,
                    response.y
                );
                keys = keys[response.selectedIndex];
                let key_names = []
                keys.forEach(key => {
                    key_names.push(key.key_name)
                });
                if (key_names.length !== 0) {
                    term.singleColumnMenu(key_names, async function (error, res2) {
                        term('\n').eraseLineAfter.green(
                            "#%s selected: %s (%s,%s)\n\n",
                            res2.selectedIndex,
                            res2.selectedText,
                            res2.x,
                            res2.y
                        );


                        let a = cdenv.deleteKey(env_id[response.selectedIndex], keys[res2.selectedIndex]._id);
                        a.then(async (res) => {
                            if (res) {
                                await term('\n').eraseLineAfter.green(` Deleted Successfully\n`);
                            }
                            exports.keys()

                        }).catch((err) => {
                            console.log("Check Your Network Connection And Be Sure You are Logged in");
                            exports.menu();
                        })


                    })
                } else {
                    term.red('Empty\n');
                    exports.keys();
                }



            })
        }
        else {
            term.red('Empty\n');
            exports.keys();
        }

    }).catch(err => {
        console.log("Check Your Network Connection And Be Sure You are Logged in");
        exports.menu();
    })
}