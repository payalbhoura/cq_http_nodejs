/*Create and expor tconfiguration variables*/

let environments = {}
//default development
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'thisis a hashingSecret',
}
//production environment
environments.production = {
  httpPort: 8000,
  httpsPort: 8001,
  envName: 'production',
  hashingSecret: 'thisis a hashingSecret',
}

//Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : ''

//Check that the current environment is one of the environments above, if not,default to staging
const environmentExport =
  typeof environments[currentEnvironment] == 'object'
    ? environments[currentEnvironment]
    : environments.staging

module.exports = environmentExport
