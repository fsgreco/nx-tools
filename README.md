# NxTools

This package contains a bunch of generator to help developing inside an Nx monorepo.

At the moment it contains only one generator called `new-component`. It help you scaffold a React Typescript component and let you choose if setting up a story file for Storybook, as well as a `.spec` file for testing.

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

---

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Documentation inside the terminal

Run `npx nx list nx-tool` to get a list of available generators inside the shell.
