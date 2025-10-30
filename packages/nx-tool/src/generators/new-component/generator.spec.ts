import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration } from '@nx/devkit';
import { vi } from 'vitest';

import { newComponentGenerator } from './generator';
import { NewComponentGeneratorSchema } from './schema';

// Mock the enquirer prompt to avoid interactive prompts during tests
vi.mock('enquirer', () => ({
  prompt: vi.fn().mockResolvedValue({ async: false })
}));

describe('new-component generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('library project', () => {
    beforeEach(() => {
      // Setup a library project
      addProjectConfiguration(tree, 'my-lib', {
        root: 'libs/my-lib',
        sourceRoot: 'libs/my-lib/src',
        projectType: 'library',
        targets: {},
      });
      // Create the barrel file
      tree.write('libs/my-lib/src/index.ts', '');
    });

    it('should generate a component with default options', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'TestComponent',
        project: 'my-lib',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that component files are generated
      const componentPath = 'libs/my-lib/src/lib/test-component';
      expect(tree.exists(`${componentPath}/test-component.tsx`)).toBeTruthy();
      
      // Check that the component is exported in the barrel file
      const indexContent = tree.read('libs/my-lib/src/index.ts', 'utf-8');
      expect(indexContent).toContain("export * from './lib/test-component/test-component'");
    });

    it('should generate a component with custom directory', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'CustomComponent',
        project: 'my-lib',
        directory: 'custom-dir',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that component is in custom directory
      const componentPath = 'libs/my-lib/src/custom-dir/custom-component';
      expect(tree.exists(`${componentPath}/custom-component.tsx`)).toBeTruthy();
      
      // Check barrel file export
      const indexContent = tree.read('libs/my-lib/src/index.ts', 'utf-8');
      expect(indexContent).toContain("export * from './custom-dir/custom-component/custom-component'");
    });

    it('should generate a component with test file when test option is true', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'TestedComponent',
        project: 'my-lib',
        test: true,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that test file is generated
      const componentPath = 'libs/my-lib/src/lib/tested-component';
      expect(tree.exists(`${componentPath}/tested-component.spec.tsx`)).toBeTruthy();
    });

    it('should NOT generate test file when test option is false', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'UntestedComponent',
        project: 'my-lib',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that test file is NOT generated
      const componentPath = 'libs/my-lib/src/lib/untested-component';
      expect(tree.exists(`${componentPath}/untested-component.spec.tsx`)).toBeFalsy();
    });

    it('should handle component names with different formats', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'my-awesome-component',
        project: 'my-lib',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that the component is created with proper naming
      const componentPath = 'libs/my-lib/src/lib/my-awesome-component';
      expect(tree.exists(`${componentPath}/my-awesome-component.tsx`)).toBeTruthy();
      
      // Check barrel file uses correct path
      const indexContent = tree.read('libs/my-lib/src/index.ts', 'utf-8');
      expect(indexContent).toContain("export * from './lib/my-awesome-component/my-awesome-component'");
    });

    it('should generate javascript component when language is js', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'JsComponent',
        project: 'my-lib',
        language: 'js',
        test: false,
        styles: 'css',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that JSX file is generated instead of TSX
      const componentPath = 'libs/my-lib/src/lib/js-component';
      expect(tree.exists(`${componentPath}/js-component.jsx`)).toBeTruthy();
    });

    it('should preserve existing exports in barrel file', async () => {
      // Add existing export
      tree.write('libs/my-lib/src/index.ts', "export * from './lib/existing-component';\n");

      const options: NewComponentGeneratorSchema = {
        name: 'NewComponent',
        project: 'my-lib',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that both exports exist
      const indexContent = tree.read('libs/my-lib/src/index.ts', 'utf-8');
      expect(indexContent).toContain("export * from './lib/existing-component'");
      expect(indexContent).toContain("export * from './lib/new-component/new-component'");
    });
  });

  describe('application project', () => {
    beforeEach(() => {
      // Setup an application project
      addProjectConfiguration(tree, 'my-app', {
        root: 'apps/my-app',
        sourceRoot: 'apps/my-app/src',
        projectType: 'application',
        targets: {},
      });
    });

    it('should NOT update barrel file for application projects', async () => {
      tree.write('apps/my-app/src/index.ts', '');

      const options: NewComponentGeneratorSchema = {
        name: 'AppComponent',
        project: 'my-app',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that component is generated (apps with sourceRoot use 'lib' directory)
      const componentPath = 'apps/my-app/src/lib/app-component';
      expect(tree.exists(`${componentPath}/app-component.tsx`)).toBeTruthy();
      
      // Check that barrel file is NOT modified (apps don't export components)
      const indexContent = tree.read('apps/my-app/src/index.ts', 'utf-8');
      expect(indexContent).not.toContain('app-component');
    });

    it('should use "components" directory for apps without sourceRoot', async () => {
      addProjectConfiguration(tree, 'my-other-app', {
        root: 'apps/my-other-app',
        projectType: 'application',
        targets: {},
      });

      const options: NewComponentGeneratorSchema = {
        name: 'ComponentInApp',
        project: 'my-other-app',
        test: false,
        styles: 'css',
        language: 'ts',
        storybook: false,
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Component should be in components directory (template adds 'src/' automatically)
      expect(tree.exists('apps/my-other-app/src/components/component-in-app/component-in-app.tsx')).toBeTruthy();
    });
  });

  describe('storybook option', () => {
    beforeEach(() => {
      addProjectConfiguration(tree, 'my-lib', {
        root: 'libs/my-lib',
        sourceRoot: 'libs/my-lib/src',
        projectType: 'library',
        targets: {},
      });
      tree.write('libs/my-lib/src/index.ts', '');
    });

    it('should NOT generate storybook file when storybook option is false', async () => {
      const options: NewComponentGeneratorSchema = {
        name: 'NoStoryComponent',
        project: 'my-lib',
        storybook: false,
        test: false,
        styles: 'css',
        language: 'ts',
        asyncStory: false,
      };

      await newComponentGenerator(tree, options);

      // Check that stories file is NOT generated
      const changes = tree.listChanges();
      const hasStoriesFile = changes.some(change => 
        change.path.includes('stories') && change.path.includes('.tsx')
      );
      
      expect(hasStoriesFile).toBeFalsy();
    });
  });
});
