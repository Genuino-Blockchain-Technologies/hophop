#!/usr/bin/env node
import meow from 'meow'
import { feature } from './commands/feature.js'
import { pr } from './commands/pr.js'

const availableCommands = ['feature', 'pr']

const cli = meow(
  `
  Usage
    $ hophop <command>

  Commands
    - feature <YouTrack ID>
    - pr

  Examples
    $ hophop feature MVP-42
    $ hophop pr
`,
  {
    importMeta: import.meta
  }
)

const [command] = cli.input

if (!availableCommands.includes(command)) {
  console.error(
    `Unknown command "${command}". Available commands are ${availableCommands
      .map(c => `"${c}"`)
      .join(', ')}`
  )

  process.exit()
}

if (command === 'feature') {
  const issueId = cli.input[1]

  if (!issueId) {
    console.error(
      'Please provide an ID of the issue, for example "genuino feature mvp-42"'
    )

    process.exit()
  }

  feature(issueId)
} else if (command === 'pr') {
  pr()
}
