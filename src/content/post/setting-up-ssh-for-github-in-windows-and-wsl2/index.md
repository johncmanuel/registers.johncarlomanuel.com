---
title: "Setting up SSH for GitHub on both Windows and WSL2"
publishDate: 2024-01-24T17:58:47.712198Z
description: "A step-by-step guide on how to setup SSH in both Windows and WSL2."
tags: ["technical", "windows", "wsl"]
---

When making changes to a Git repository and pushing them to your remote origin (usually located on GitHub), sometimes Git would ask you for your credentials, such as username and password. Note that if using GitHub to make changes, [password authentication is outdated](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls), so rather than using your password when asked, for example, they expect you to use your [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). Or better yet, you can use their [credential manager](https://github.com/GitCredentialManager/git-credential-manager/blob/main/README.md) to do this.

All of these methods are valid and get the job done, but the thing is, there is a better way to safely authenticate with GitHub, and that's using [secure shell, or SSH](https://en.wikipedia.org/wiki/Secure_Shell).

There are a lot of benefits to using SSH for GitHub, such as [not needing to input your username and personal access token as your password](https://en.wikipedia.org/wiki/Secure_Shell) for every time you need to make a change. If you're currently using the username/password method, this will save tons of time in the long-term!

This is good, but the thing is: your SSH keys (vital parts of SSH) are only tied to one machine (your computer in this case). If you plan to do a ton of development using [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about) rather than your native Windows environment, this can be a bit of a problem. The problem is: WSL treats itself as its own separate machine. That means, it needs another pair of SSH keys to authenticate with GitHub.

I'll teach you how to setup SSH for both Windows and WSL2 (version 2 of WSL).

## Prerequisites

1. Be a proud Windows owner!
2. [Install WSL2 (any distro will work)](https://learn.microsoft.com/en-us/windows/wsl/install)
3. Familiarity with basic Git commands and concepts.

If you have an existing SSH key used for GitHub, you can [skip to the second part of the guide](#sharing-ssh-keys-with-windows-on-wsl2).

## Setting up SSH on Windows

For this guide, I will be using Windows Command Prompt. I recommend following along with the Command Prompt. Though, when saving the SSH key to the [ssh-agent](https://en.wikipedia.org/wiki/Ssh-agent), I will switch over to PowerShell.

First, create a public/private key pair using the command below. This will use the ed25519 signature scheme from [the EdDSA algorithm](https://en.wikipedia.org/wiki/EdDSA), but other algorithms will suffice (i.e [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>)).

```bat
# use ed25519
ssh-keygen -t ed25519 -C "<your github account's email>"

# or...

# use RSA
ssh-keygen -t rsa -b 4096 -C "<your github account's email>"
```

The public/private key pair will use your email as the label.

The following output will be printed:

```bat
> Generating public/private <algorithm used> key pair.
> Enter file in which to save the key (/c/Users/YOU/.ssh/id_<algorithm used>):
```

Use the default file location by simply pressing **Enter**.

Then, the following will ask you for a **passphrase**. You can opt to not use one, but **it's highly recommended to add one**. Store it somewhere safe if you choose to add one.

```bat
> Enter passphrase (empty for no passphrase): <your passphrase>
> Enter same passphrase again: <your passphrase>
```

Now, using PowerShell with admin privileges, add the SSH key pair to your ssh-agent.

```bat
Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent
```

You may close PowerShell.

Next, in another terminal add your SSH **private** key to the ssh-agent.

```bat
ssh-add C:/Users/<name of your user folder>/.ssh/id_<algorithm used>
```

## Add SSH Key to GitHub

To ensure that your GitHub account uses the SSH key you generated, we will add the public key of the pair to your GitHub account.

## Sharing SSH Key with Windows on WSL2

Open a terminal in WSL.

## References

1. [Adding a new SSH key to your GitHub account - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
2. [Sharing SSH keys between Windows and WSL 2 - Burke Holland, Microsoft DevBlogs](https://devblogs.microsoft.com/commandline/sharing-ssh-keys-between-windows-and-wsl-2/)
3. [Generating a new SSH key and adding it to the ssh-agent - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
