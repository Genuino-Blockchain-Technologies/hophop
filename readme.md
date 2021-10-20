# Genuino's hophop

This is a helper for speeding up the YouTrack/GitLab workflow from the terminal.

## Installation

### As a global package

You can install this package as global, like so:

```
# With NPM
npm install --global @genuino-blockchain-technologies/hophop

# With Yarn
yarn global add @genuino-blockchain-technologies/hophop
```

### As a local package

You can install the package locally:

```
# If you are using NPM
npm install @genuino-blockchain-technologies/hophop

# If you are using Yarn
yarn add @genuino-blockchain-technologies/hophop
```

> **Note:** in this case, you will need to add `npx` before each command, e.g. `npx hophop pr` instead of `hophop pr`

### Through `develop.sh`

If your repository has a `develop.sh` file, chances are it already has `hophop` built-in.

> **Note:** in this case, you will need to add `./develop.sh` before each command, e.g. `./develop.sh hophop pr` instead of `hophop pr`

## Usage

Every time you start working on a new issue (i.e.: feature or bug), you can checkout the `develop` branch and use the `feature` command:

```
# Do not copy-paste this as is, it is just an example
hophop feature <issue-id-here>
```

For example, if you are working on an issue called "MVP-42", you run this:

```
# If you copy-paste this, please replace "mvp-42" with the ID of your issue
hophop feature mvp-42
```

> Note: the ID of the issue is interpreted in a case insensitive fashion, so either "MVP-42" or "mvp-42" are valid ways of issuing the command

Once you are ready to create a merge request, you can do it automatically through the `pr` command:

```
hophop pr
```

There is no need to specify which issue you are referring to, everything happens automatically.

## Credentials insertion

The first time you use `hophop`, it will ask you for credentials. These are a YouTrack permanent token and a GitLab personal token. Both are used to gain the permissions required to interact with the corresponding APIs.

### YouTrack permanent token

To get a YouTrack permanent token, access YouTrack. Once you are in the dashboard, click on the profile icon at the top-right corner of the page.

Select "Profile", then look for the "General" tab and the "Hub account" entry. Click on "Update personal information and manage logins".

On the next page, click on the "Authentication" tab and then click on the "New token…" button. Give it a name of your choice, input a reasonable expiration date, and select the "YouTrack" scope (it is the only scope needed). Copy the newly created token and paste it in the terminal to answer the question.

### GitLab personal token

To get a GitLab personal token, access GitLab. Once you are in the homepage, click on the profile icon at the top-right corner of the page.

Select "Settings", then look for the "Access Tokens" menu option. Click on it.

Once in the settings page, in the section named "Add a personal token", give it a name of your choice, input a reasonable expiration date, then give the token these scopes:

- api
- read_api
- read_repository
- write_repository

Click on "Create personal access token", copy the token, paste it in the terminal to answer the question.

## Known issues

- If your repository has more than one remote, everything will break.
- In order to use the `pr` command, your branch has to have a name that starts with `mvp-NNN_` (with `NNN` being the number of the issue). If you named your branch manually, you may not be able to create a merge request with `hophop`.
- The `pr` command has been tested on one repo only. We all know that if something worked once, it will work forever, right?
