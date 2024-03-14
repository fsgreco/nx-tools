# NxTool

This package contains a bunch of generator to help developing inside an Nx monorepo.

At the moment it contains only one generator called `new-component`. It helps you scaffold a React Typescript component and let you choose if setting up a story file for Storybook, as well as a `.spec` file for testing. 

## How to use it

First install it on your own monorepo:
```sh
npm install -D nx-tool
```
Then use it like any other generator and follow the prompted guided proceedure (short version):
```sh
nx g new-component [your_component_name]
```
The component name is optional, in case you don't insert it it will be asked.  
As with any other Nx generator you can pass options like `--dry-run` to test the commands.  
An example of this with the long version command:
```sh
npx nx generate nx-tool:new-component --dry-run
```
