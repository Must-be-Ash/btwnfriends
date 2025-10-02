# Git Repository Management Commands

## 1. Disconnect from a repository

To disconnect from the current repository (remove the remote connection):

```bash
# Remove the origin remote connection
git remote remove origin

# Or if you have multiple remotes, you can remove a specific one
git remote remove <remote-name>
```

## 2. Check the repository you are connected to

To check which repository you are currently connected to:

```bash
# List all remote repositories
git remote -v

# Show detailed information about remotes
git remote show origin

# Check the current branch and its upstream
git branch -vv
```

## 3. Connect to a new repository

To connect to the repository `https://github.com/Must-be-Ash/btwnfriends`:

```bash
# Add the new repository as origin remote
git remote add origin https://github.com/Must-be-Ash/btwnfriends

# Verify the connection
git remote -v

# If you want to push your current branch to the new repository
git push -u origin main
```

## Additional Useful Commands

```bash
# Check current status
git status

# See all branches (local and remote)
git branch -a

# Change the URL of an existing remote
git remote set-url origin https://github.com/Must-be-Ash/btwnfriends

# List all remotes with their URLs
git remote -v
```
