#! /usr/bin/env bash
#shellcheck disable=SC2154 

# This time we bumps all workspaces and the root one too 
# (the bump of the root one will be commited and tagged automatically)
# then we proceed to add the uncommited package* files and commit

version_bump=${1:-'patch'} # major | minor | patch | custom... 
next_version=$(semver "$npm_package_version" -i "$version_bump" 2>/dev/null || echo "")

# Fallback to datestring if next_version is empty
if [ -z "$next_version" ]; then
  next_version=$(date +"%Y-%m-%d_%H-%M-%S")
  echo "Warning: semver failed, using datestring: $next_version";
	echo "Warning: Do not run this script manually. Use npm scripts instead.";
fi

git switch main \
&& git fetch --all \
&& git pull \
&& npm version "$version_bump" -ws --include-workspace-root \
&& git add package*.json packages/**/package*.json \
&& git commit -m "New $version_bump update v$next_version" \
&& git tag -a "deploy-$version_bump-$next_version" -m "Deploy $version_bump v$next_version" \
&& git push --follow-tags