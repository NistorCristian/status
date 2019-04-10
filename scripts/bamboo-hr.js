const fs  = require('fs')
const yml = require('js-yaml')
const log = require('fancy-log')
const err = log.error
const request = require('request-promise')

/**
 * If you want to debug the requests use NODE_DEBUG=request.
 **/

const API_ORG = 'statusim' || process.env.BAMBOO_API_ORG
const API_TOKEN = process.env.BAMBOO_API_TOKEN
if (!API_TOKEN) {
  err('Environment variable BAMBOO_API_TOKEN not set!')
}else{
  const API_URL = `https://api.bamboohr.com/api/gateway.php/${API_ORG}/v1`
  const DEFAULT_FIELDS = [
    'displayName', 'firstName', 'lastName', 'employeePhoto', 'photoUploaded',
    'jobTitle', 'division', 'workEmail', 'photoUrl', 'avatarMedium',
    'customStatusPublicKey', 'customGitHubusername',
  ].join(',')
  
  const DEFAULT_OPTIONS = {
    auth: { user: API_TOKEN, pass: 'x' },
    headers: { 'Accept': 'application/json' },
    json: true,
  }
  
  const getEmployee = async (id, fields = DEFAULT_FIELDS) => {
    log(`Querying employee: ${id}`)
    return await request.get({
      ...DEFAULT_OPTIONS,
      uri: `${API_URL}/employees/${id}`,
      qs: { fields },
    })
  }
  
  const getEmployeesList = async () => {
    return await request.get({
      ...DEFAULT_OPTIONS,
      uri: `${API_URL}/employees/directory`,
    })
  }
  
  /* some people give username, some URL */
  const cleanGitHubUsername = (data) => {
    if (data.customGitHubusername) {
      let matches = data.customGitHubusername.match(/https:\/\/github.com\/(.*)/)
      data.customGitHubusername = (matches) ? matches[1] : data.customGitHubusername
    }
  }
  
  const saveEmployees = async (outFilePath) => {
    let data = await getEmployeesList()
    log(`Found active employees: ${data.employees.length}`)
  
    let employees = []
    for (let employee of data.employees) {
      let rval = await getEmployee(employee.id)
      cleanGitHubUsername(rval)
      employees.push(rval)
    }
  
    yamlText = yml.safeDump({ employees }, {lineWidth: 200})
    let fileContents = (
      "# Managed via 'employees' gulp task\n" + yamlText
    )
    fs.writeFileSync(outFilePath, fileContents)
    log(`Saved to: ${outFilePath}`)
  }
  
  module.exports = { saveEmployees }

}
