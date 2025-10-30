# NxTool

This package contains an Nx generator called `new-component` that aims to help the frontend developing process by generating and scaffolding boilerplate for you. It scaffolds a React tsx or jsx component and let you choose if setting up a story file for Storybook, as well as a `.spec` file for testing.

✨ **You can run it everywhere!** ✨  
Meaning not only in Nx projects but also in any NodeJs frontend project.  

![new-component-demo](https://github.com/fsgreco/nx-tools/assets/22715417/4ed0cfe4-1ff0-4935-9896-7a640d60a791)

NOTE: it is still under development, at the moment of writing generated files are particularly opinionated. Feedback is appreciated.

## Install and usage

First install it on your own project:

```sh
npm install -D nx-tool
```

To try it you only need this command:

```bash
npm run new:component
```

### More information and alternative commands

#### With optional arguments

You can pass optional arguments too:

```bash
npm run new:component [component_name] [-- --lang js --dir hooks --dry-run]
```

|   Option   | shorthand |                                                             Description                                                |
|:----------:|:---------:|------------------------------------------------------------------------------------------------------------------------|
|  --test    |     -t    | Choose between `false` or `true` (in case simply pass `-t`) to have a test file too.  |
|  --style   |     -s    | Choose between `css`,`styled-components`,`none` to decide which style sistem use.  |
|  --story   |    --sb   | Choose between `false` or `true` (then simply pass `--story` or `--sb`) to have a storybook file too    |
|  --dir     |     -d    | [Optional] Choose a custom directory. By default its either `components` or `lib` (if it recognizes an Nx library).  |
|  --lang    |     -l    | [Optional] Choose between `js` or `ts` (default) / files will be generated with `.jsx` or `.tsx` extensions.  |
|  --dry-run |           | No changes will be made, the CLI will only show you what files should be generated. |

Remember: if you use the npm scripts command prefix the options with `--`.  
Some examples:

```bash
# A minimal component (no styles, neither test nor storybook files too):
npm run new:component -- -s none -t false --sb false

# A component with styled-dictionary and a storybook file too
npm run new:component -- --style styled-dictionary --story

# A component with `.jsx` extension inside `src/hooks` directory
npm run new:component -- --lang js --dir hooks
```

#### Suggestion  

You can customize your script per project and minimize the questions.  
Simply change the script inside your `package.json` > `"scripts"` > `"new:component"`.  
E.g.:

```json
"new:component": "npx nx g nx-tool:new-component --lang js --style styled-components --story false"
```

With this in place, whenever you run `npm run new:component`, the script will always create a component with `.jsx` extension, `styled-components` boilerplate in place and no storybook file (it will not be asked).

---

#### Understand this generator under the hood

This tool works like any other Nx generator and follow the prompted guided proceedure.  
Indeed you can run it by using the classic nx command (short version e.g.):

```sh
nx g new-component [your_component_name]
```

The _component name_ is optional, in case you don't insert it it will be asked to you.  
As with any other Nx generator you can pass options like `--dry-run` to test the commands.  
An example of this with the Nx long version command:  

```sh
npx nx generate nx-tool:new-component --dry-run
```

#### Troubleshooting: equip your 'package.json'

If `npm run new:component` does not work run this to adeguate your own `package.json`:

```bash
npx nx-tool equip
```

---

## Development

### Running Tests

```bash
npx nx test nx-tool
```

The test suite validates:

- **Component generation** in libraries and applications with various configurations (TypeScript/JavaScript, custom directories, different styles)
- **Test file creation** based on the `--test` flag
- **Storybook file exclusion** when `--story false` is set
- **Barrel file exports** are correctly added to library `index.ts` (but not for apps)
- **File naming conventions** handle kebab-case, PascalCase, and custom formats

All tests use Nx's testing utilities to simulate file generation without actual file system changes.

