import fs from 'fs'
import inquirer from 'inquirer'

export async function ensureCredentials() {
  let credentials = ''
  const credentialsFileUrl = new URL('../.credentials', import.meta.url)

  try {
    credentials = fs.readFileSync(credentialsFileUrl, 'utf-8')
  } catch (ex) {
    fs.writeFileSync(credentialsFileUrl, '', 'utf-8')
  }

  if (!credentials) {
    const { youtrackToken, gitlabToken } = await inquirer.prompt([
      {
        name: 'youtrackToken',
        message:
          'Please provide a YouTrack token: go to https://genuino.myjetbrains.com/youtrack/, click on the icon at the top-right corner, then Profile, "Update personal information and manage logins", "Authentication" and create a new permanent token with "YouTrack" scope.'
      },
      {
        name: 'gitlabToken',
        message:
          'Please provide a GitLab token. Go to https://gitlab.genuino.tech/, click on the icon at the top-right corner, then "Settings", "Access Tokens" and create a new token with "api", "read_api", "read_repository" and "write_repository" scopes.'
      }
    ])

    fs.writeFileSync(credentialsFileUrl, `${youtrackToken}\n${gitlabToken}`)

    return { youtrackToken, gitlabToken }
  } else {
    const [youtrackToken, gitlabToken] = credentials.split('\n')
    return { youtrackToken, gitlabToken }
  }
}
