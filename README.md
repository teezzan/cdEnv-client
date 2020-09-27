# cdEnv

cdEnv is a NodeJS client library for communicating with cdenv.tech. CdEnv is an environment management system hosted on the cloud used for seemless delivery of personalized environment across all production or test servers.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install cdEnv.

```bash
npm install --save cdenv
```

## Usage
Using the library is very simple and straightforward. You will need to sign up, verify your email and generate a personalized token for your application. This can be done via the in-built cli interface of cdEnv. This is described later in the document. 

After generating your API Key, creating your environment and populating the environment, you can use the following snippet of code to import the environment variable into your test or deployment server at will.

```javascript
let cdenv = require('@teehazzan/cdenv');
cdenv.fetch('MJ9SQ6D-WS6MMQ5-NJGPABC-BS832KT','TEST_APP_ENV');
```
This will populate your environment with the variables.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)