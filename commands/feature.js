import fetch from 'node-fetch'
import { ensureCredentials } from '../utils/ensureCredentials.js'
import simpleGit from 'simple-git'

export async function feature(issueId) {
  const { youtrackToken } = await ensureCredentials()

  const git = simpleGit({
    baseDir: process.cwd()
  })

  /**
   * @type Promise<{
   *   error: string
   *   error_description: string
   * } | {
   *   idReadable: string
   *   summary: string
   *   $type: 'Issue'
   * }>
   */
  const response = await fetch(
    `https://genuino.myjetbrains.com/youtrack/api/issues/${issueId}?fields=idReadable,summary`,
    {
      headers: {
        Authorization: `Bearer ${youtrackToken}`
      }
    }
  ).then(response => response.json())

  if (response.error) {
    console.error(
      `An error occurred while retrieving the issue: ${response.error_description}`
    )
    process.exit()
  }

  const slug = response.summary.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_')
  const branchName = `feature/${response.idReadable}_${slug}`

  await git.checkoutBranch(branchName, 'develop')

  console.log(`Created a new branch ${branchName} 🚀`)
}
