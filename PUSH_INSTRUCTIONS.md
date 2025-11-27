# How to Push to GitHub Pages

Your build is ready in `scorekeeper-app/dist/` but you need authentication to push.

## Option 1: Use GitHub Desktop (Easiest)

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose: `c:\Users\cgcda\dartstream\scorekeeper-app\dist`
4. Click "Publish repository"
5. Repository name: `dartstream1`
6. Branch: `gh-pages`
7. Click Publish

## Option 2: Personal Access Token (Command Line)

### Step 1: Create Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `dartstream-deploy`
4. Scopes: Check ✅ `repo` (all sub-options)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Push with Token
```powershell
cd c:\Users\cgcda\dartstream\scorekeeper-app\dist
git push -f https://YOUR_TOKEN@github.com/dowdarts/dartstream1.git master:gh-pages
```

Replace `YOUR_TOKEN` with the token you copied.

## Option 3: VS Code Git Panel

1. Open VS Code
2. Open folder: `c:\Users\cgcda\dartstream\scorekeeper-app\dist`
3. Source Control panel (Ctrl+Shift+G)
4. Click "..." → Push to → Choose `gh-pages` branch
5. Sign in with GitHub when prompted

## Option 4: Setup SSH Keys (For Future)

### Generate SSH Key:
```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Press Enter 3 times (default location, no passphrase)

### Add to GitHub:
1. Copy public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
   ```
2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste the key
5. Save

### Then push:
```powershell
cd c:\Users\cgcda\dartstream\scorekeeper-app\dist
git push -f git@github.com:dowdarts/dartstream1.git master:gh-pages
```

## What Gets Deployed

Once pushed, these URLs will be live:
- **Scorekeeper**: https://dowdarts.github.io/dartstream1/
- **Scoreboard**: https://dowdarts.github.io/dartstream1/scoreboard.html

Both apps are in the `dist/` folder ready to go!
