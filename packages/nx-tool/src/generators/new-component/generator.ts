import {
	applyChangesToString,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { NewComponentGeneratorSchema } from './schema';

import { ensureTypescript } from '@nx/js/src/utils/typescript/ensure-typescript'

import { addImport } from '@nx/react/src/utils/ast-utils'

// TODO import { componentTestGenerator, componentStoryGenerator } from '@nx/react'

export async function newComponentGenerator(
  tree: Tree,
  options: NewComponentGeneratorSchema
) {

  const project = readProjectConfiguration(tree, options.project); // root, name, sourceRoot 
	const projectRoot = project.root
	const projectSourceRoot = project.sourceRoot ?? project.root
	
	const filename = names(options.name).fileName
	const name = names(options.name).className

	const extendedOptions = {
		...options,
		name,
		filename
	}

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, extendedOptions);

	/**
	 * Add exports to barrel file:
	 * Consult examples on nx/react/generators/component 
	 */
	const isApp = project.projectType === 'application'
	if (!isApp) {
		let indexFilePath = joinPathFragments(projectSourceRoot, 'index.ts') // use projectSourceRoot directly ?
		let indexFile = tree.read(indexFilePath, 'utf-8')

		let tsModule: typeof import('typescript');
		if (!tsModule) tsModule = ensureTypescript()
		if ( indexFile !== null ) {
			let indexSourceFile = tsModule.createSourceFile(indexFilePath,indexFile,tsModule.ScriptTarget.Latest, true)

			// Assumes the new component is at 'src/lib/NewComponent' - check `files` folder
			const newComponentPath = path.join( projectSourceRoot, 'lib', filename);

			// Get the relative path from the project source root to the new component
			const relativePath = path.relative(projectSourceRoot, newComponentPath);

			//console.log({ relativePath })
			const addExport = addImport( indexSourceFile , `export { default as ${name}} from './${relativePath}';` )
			const changes = applyChangesToString( indexFile, addExport )
			tree.write(indexFilePath, changes)
		}
	}

  await formatFiles(tree);
}

export default newComponentGenerator;
