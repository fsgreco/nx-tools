#! /usr/bin/env node
import { FsTree } from "nx/src/generators/tree"
import { readJsonFile /* , updateJson  */} from "@nx/devkit"
import { spawnSync } from "node:child_process"

//const projectDir = process.env.INIT_CWD || path.resolve('../../') || path.dirname( path.dirname( process.cwd() ) )
const projectDir = process.env.INIT_CWD || process.cwd()

process.chdir(projectDir)

const tree = new FsTree( projectDir, false )

// If both of this are false then hic sunt leones (it is not an Nx project)
const isNxProject = tree.exists('nx.json') 
const hasProjectJson = tree.exists('project.json') 

// Read the package Json to known if this is an npm monorepo
const packageJson = readJsonFile(tree.root + '/package.json') satisfies Record<string,any>

// check if package.json is not an npm monorepo and does not have "nx" property
const hasNx = packageJson.hasOwnProperty('nx')
const hasWorkspaces = packageJson.hasOwnProperty('workspaces')

const parseExitCode = (code: number | null) => code === 0 ? '✅' : '🔴'

if (!isNxProject && !hasProjectJson && !hasWorkspaces && !hasNx ) {
	//updateJson(tree, 'package.json', (json) => { json.nx = {}; return json; } )
	let result = spawnSync('npm',['pkg','set','nx={}','--json'])
	console.log(parseExitCode(result.status) + ' Add workaround on package.json')
} 

const hasScript = packageJson?.scripts.hasOwnProperty("new:component")
if (!hasScript) {
	const result = spawnSync('npm',['pkg','set','scripts.new:component=npx nx g nx-tool:new-component'])
	console.log(parseExitCode(result.status) + ' Add new script on package.json')
}

console.log('✅ All done.')