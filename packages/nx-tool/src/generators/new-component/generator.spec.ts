import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { newComponentGenerator } from './generator';
import { NewComponentGeneratorSchema } from './schema';

describe('new-component generator', () => {
  let tree: Tree;
  const options =  { name: 'test', project:'ui', storybook: false, test:false } as NewComponentGeneratorSchema;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await newComponentGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
