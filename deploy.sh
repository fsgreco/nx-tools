#! /usr/bin/env bash
#shellcheck disable=SC2154 

# This time we bumps all workspaces and the root one too 
# (the bump of the root one will be commited and tagged automatically)
# then we proceed to add the uncommited package* files and commit

version_bump=${1:-'patch'} # major | minor | patch | custom... 
next_version=$(semver "$npm_package_version" -i "$version_bump")

git switch main \
&& npm version "$version_bump" -ws --include-workspace-root \
&& git add package*.json packages/**/package*.json \
&& git commit -m "New $version_bump update v$next_version" \
&& git tag -a "deploy-$version_bump-$next_version" -m "Deploy $1 v $next_version" #\
#&& git push --follow-tags
echo "DEBUG: ALL DONE"