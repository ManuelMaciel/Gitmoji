import { writeFile, readFile, chmod } from 'fs/promises'
import inquirer from 'inquirer';
import fetch from 'cross-fetch';
import chalk from 'chalk';
import { pathExists } from 'path-exists';
import fileExists from 'file-exists';

const gitEmoji = 'https://raw.githubusercontent.com/ManuelMaciel/Gitmoji/main/data/emojis.json?token=GHSAT0AAAAAABNXZPZ7VPBM4FUPGZPWXOPIYPA5FYA'
const prepareCommit = 'prepare-commit';

const gitmojiCommitHookComand = `#!/bin/sh
exec < /dev/tty
gitmoji-commit-hook $1
`;

const errorMessage = {
	notGitRepo: 'This is not a git repository',
	commitHookAlreadyExists: 'Commit hook already exists, please remove it first (gitmoji-commit-hook --remove), or run the command with --force flag',
	commitHookNotExists: 'Commit hook does not exist, please run the command with --install flag',
	gitParse: `Could not find emoji at ${chalk.yellow(gitEmoji)}`,
}

const handlerError = (error) => {
	console.log(chalk.red(`❌ Error occured: ${error}`));
	process.exit(1);
}

const reject = (errorMessage) => {
	return val => val ? Promise.reject(new Error(errorMessage)) : val;
}

const notReject = (errorMessage) => {
	return val => val ? val : Promise.reject(new Error(errorMessage));
}

const getListEmojis = async () => {
	try {
		const { emojis } = await fetch(gitEmoji).then(res => res.json());
		console.log(chalk.green(`✅ ${chalk.green('Emojis found')}`));
		if(!emojis) {
			throw new Error(errorMessage.gitParse);
		}
	} catch (error) {
		throw new Error(errorMessage.gitParse + '\n' + error);
	}
}
getListEmojis()
