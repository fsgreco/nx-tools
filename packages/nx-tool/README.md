# NxTool

This package contains an Nx generator that aims to help the frontend developing process by generating and scaffolding boilerplate for you.

✨ **You can run it everywhere!** ✨  
Meaning not only in Nx projects but also in any NodeJs frontend project.  

At the moment it contains only one generator called `new-component`.  
It scaffolds a React Typescript component and let you choose if setting up a story file for Storybook, as well as a `.spec` file for testing. 

NOTE: at the moment of writing this is in early stages and the generated files are particularly opinionated.

## Install and usage

First install it on your own project:
```sh
npm install -D nx-tool
```
To try it you only need this command:
```bash
npm run new:component
```

### More information and alternative commands: 

#### With optional arguments:
You can pass optional arguments too:
```bash
npm run new:component [component_name] [-- --dry-run]
```

#### Understand this generator
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
