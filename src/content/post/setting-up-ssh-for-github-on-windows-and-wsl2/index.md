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

If you have an existing SSH key used for GitHub, you can [skip to the second part of the guide](#sharing-ssh-key-with-windows-on-wsl2).

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
> Enter file in which to save the key (/c/Users/<username>/.ssh/id_<algorithm used>):
```

Use the default file location by simply pressing **Enter**.

Then, the following will ask you for a **passphrase**. You can opt to not use one, but **it's highly recommended to add one**. Store it somewhere safe if you choose to add one.

```bat
> Enter passphrase (empty for no passphrase): <your passphrase>
> Enter same passphrase again: <your passphrase>
```

Now, using PowerShell with admin privileges, add the SSH key pair to your ssh-agent. This will start a service in your computer called **ssh-agent**.

```bat
Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent
```

You may close PowerShell.

Next, in another terminal of your choice, add your SSH **private** key to the ssh-agent.

```bat
ssh-add C:/Users/<name of your user folder>/.ssh/id_<algorithm used>
```

## Add SSH Key to GitHub

To ensure that your GitHub account uses the SSH key you generated, we will add the public key of the pair to your GitHub account.

First, open PowerShell and copy the SSH public key to your clipboard:

```bash
cat ~/.ssh/id_<algorithm used>.pub | clip
```

On GitHub, click on your profile picture and click **Settings**.

![Settings link on GitHub](./0.png "Settings are at the very bottom.")

- Under the _Access_ section, look for **SSH and GPG keys**.
- Click **New SSH Key** or **Add SSH Key**.
- Add a label for your key under the **Title** field.
- For **Key type**, click **Authentication Key**.
- Paste your SSH public key in the **Key** field.
- Click **Add SSH Key**

Your SSH public key is now securely stored on GitHub!

## Sharing SSH Key with Windows on WSL2

Now that the SSH key in Windows is generated and it's currently being used by GitHub, it's time to reuse the key in a WSL2 environment!

Open a terminal in WSL (either PowerShell or Command Prompt) using the command below:

```bat
wsl
```

Then copy over the SSH key from Windows to WSL:

```bash
cp -r /mnt/c/Users/<username>/.ssh ~/.ssh
```

Adjust the permissions on the recently copied SSH key:

```bash
chmod 600 ~/.ssh/id_<algorithm used>
```

This command means **only the owner** can read/write the file.

In order to avoid entering the passphrase for your SSH key every time you wish to change the remote origin, use [keychain](https://www.funtoo.org/Funtoo:Keychain):

```bash
sudo apt install keychain
eval ``keychain --eval --agents ssh id_<algorithm used>
```

Now test the SSH authentication using the following command:

```bash
ssh -T git@github.com
```

It may trigger warnings like these:

```text
> The authenticity of host 'github.com (IP ADDRESS)' can't be established.
> <algorithm used> key fingerprint is <some very long fingerprint here>.
> Are you sure you want to continue connecting (yes/no)?
```

You may want to reference the below to see if GitHub's public key fingerprints match the appropiate fingerprint that was printed:

- `SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s (RSA)`
- `SHA256:br9IjFspm1vxR3iA35FWE+4VTyz1hYVLIE2t1/CeyWQ (DSA - deprecated)`
- `SHA256:p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM (ECDSA)`
- `SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU (Ed25519)`

> Source: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints>.
>
> Double check for the latest fingerprints there just to be safe.

If it matches, you can type **yes**. Once successful, GitHub will authenticate you. You're done!

## Conclusion

Congratulations! You have successfully set up SSH for both Windows and WSL2. You can now safely authenticate with GitHub without having to use your username and password.

Happy coding! :)

## References

1. [Adding a new SSH key to your GitHub account - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
2. [Sharing SSH keys between Windows and WSL 2 - Burke Holland, Microsoft DevBlogs](https://devblogs.microsoft.com/commandline/sharing-ssh-keys-between-windows-and-wsl-2/)
3. [Generating a new SSH key and adding it to the ssh-agent - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
4. [Testing your SSH connection - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)
