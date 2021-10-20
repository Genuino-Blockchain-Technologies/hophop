import fetch from 'node-fetch'
import SimpleGit from 'simple-git'
import { ensureCredentials } from '../utils/ensureCredentials.js'
import open from 'open'

export async function pr() {
  const git = SimpleGit()
  const { youtrackToken, gitlabToken } = await ensureCredentials()
  const { current: currentBranchName } = await git.status()
  const remotesList = await git.getRemotes(true)

  if (remotesList.length > 1) {
    console.error(
      "Multiple remotes found in the GIT repository. I'm not ready to handle this."
    )

    process.exit()
  }

  const [, repoName] = remotesList[0].refs.push.match(/.+\/([^\/]+)\.git$/)

  /**
   * @type Promise<Array<{
   *   id: number
   *   name: string
   * }>>
   */
  const reposList = await fetch(
    'https://gitlab.genuino.tech/api/v4/projects/',
    {
      headers: {
        Authorization: `Bearer ${gitlabToken}`
      }
    }
  ).then(response => response.json())

  const repoData = reposList.find(repo => repo.name === repoName)

  if (!repoData) {
    console.error(
      'Unable to find the repo. The algorithm is pretty stupid though.'
    )

    process.exit()
  }

  const repoId = repoData.id
  const [, issueId] = currentBranchName.match(/^feature\/([^_]+)_.+$/)

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
  const issue = await fetch(
    `https://genuino.myjetbrains.com/youtrack/api/issues/${issueId}?fields=idReadable,summary`,
    {
      headers: {
        Authorization: `Bearer ${youtrackToken}`
      }
    }
  ).then(response => response.json())

  if (issue.error) {
    console.error(
      'Unable to find an issue related to this branch on YouTrack. If you named this branch manually, chances are you are out of luck.'
    )

    process.exit()
  }

  /**
   * @type Promise<{
   *   web_url: string
   * }>
   */
  const result = await fetch(
    `https://gitlab.genuino.tech/api/v4/projects/${repoId}/merge_requests`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gitlabToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: repoId,
        title: `${issue.idReadable} - ${issue.summary}`,
        source_branch: currentBranchName,
        target_branch: 'develop',
        remove_source_branch: true
      })
    }
  ).then(response => response.json())

  open(result.web_url)
}
