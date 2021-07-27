# cdEnv-client

[cdEnv](https://github.com/teezzan/cdEnv) is a self-hostable and secured system for storing keys and variables for different environments and projects. It allows easy access via HTTP API and CLI.

**This is a client to access any hosted [cdEnv](https://github.com/teezzan/cdEnv) instance in your code and via the CLI.**


## Screenshots/Demo
![ScreenShot](https://github.com/teezzan/cdEnv/blob/master/images/cdenv.png)
## Built With

- [Nodejs](https://nodejs.org/en/)


## Example Code

The variables in an environment can be accessed as a `key:value` pair via an HTTP API request to the hosted app. This library was developed to do this and many more. It is as simple as 

```javascript
let cdenv = require('cdenv');
cdenv.fetch('API-TOKEN-GENERATED-FROM-SERVER','APP-ENVIRONMENT-NAME', "URL_TO_SERVER_INSTANCE");

```
where `API-TOKEN-GENERATED-FROM-SERVER` is your user generated secret token, `APP-ENVIRONMENT-NAME` is the name of your environment on the server and `URL_TO_SERVER_INSTANCE` is the url to access your server instance running [cdEnv](https://github.com/teezzan/cdEnv).


You could also add the URL to your [cdEnv](https://github.com/teezzan/cdEnv) to path as `CDENV_SERVER`and the code becomes

```javascript
let cdenv = require('@teehazzan/cdenv');
cdenv.fetch('S2W42GJ-VM041FV-H00RZT5-6PG63F5','Heroku_Env');

```
This will populate your environment with the variables.

## Quick Installation
Using npx, running the following will get ypu started quickly.
```bash
npx cdenv
```

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install this cdEnv client.

```bash
npm install --save cdenv
```
 or run `npm install -g cdenv` to install system-wide.


## Starting CLI Console
This library comes packaged with a cli interface to help ease setting up of environments. You can 
- Signup as a User
- Login as a User
- Create environments and populate it with Keys and values
- View environmental Keys and Variables.
- Modify and delete environments.
- Generate and Revoke access tokens.
- and many more.

**You need to add the URL to your [cdEnv](https://github.com/teezzan/cdEnv) to path as `CDENV_SERVER`.**

Simply run the cli with its command. 

```bash
cdenv
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)