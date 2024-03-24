---
title: "Setting up Nix with VSCode"
publishDate: 2024-03-24T15:28:15.648614Z
description: "How to setup and integrate a Nix environment in VSCode."
tags: ["technical", "windows", "nix", "wsl"]
---

I've recently been learning Nix and its package manager and implemented them in a few projects. It's honestly a great tool, even though the learning curve is pretty high! It basically makes setting up project environments, especially in a collaborative one, much easier and doesn't require manually installing any third-party software required for the project.

For a [current team project](https://github.com/Skyline-College-Computer-Science-Club/skyline-shines-webhook) I'm working on, I wanted to not only setup a Nix environment but also add in a VSCode extension that would enhance the developer experience for maintainers using VSCode. This would integrate Nix and VSCode extremely well.

But how can you do that? Let's go find out!

## Download Nix

You want to download Nix here first: <https://nixos.org/download/>

> NOTE: For Windows users, don't forget to download WSL2! [See here for more information](https://learn.microsoft.com/en-us/windows/wsl/about)! Any Linux distribution should work!

However, if you feel intimidated by it, [see this great resource for getting started with Nix](https://nix.libdb.so/slides). This will not only provide a concise introduction but also with its own [install script](https://nix.libdb.so/).

> NOTE: For Windows users, you may want to download [systemd](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/) and activate it in your WSL2 environment to make Nix work. I had a bit of a struggle installing Nix before, and this was my solution to it.

## Create a `shell.nix`

In your new or existing project, create a `shell.nix` file, which is the basis for your Nix environment.

> NOTE: For Windows users, make sure you open the project in WSL2!
> You can simply open a terminal, activate WSL2, navigate to your project directory, and open it with `code .`

Here's an example from one of my projects mentioned earlier that sets up a Nix environment and installs [Deno](https://deno.com/):

```nix
# Source: https://github.com/Skyline-College-Computer-Science-Club/skyline-shines-webhook/blob/master/shell.nix

{ sysPkgs ? import <nixpkgs> {} }:
let
	pkgs = import (sysPkgs.fetchFromGitHub {
		owner = "NixOS";
		repo = "nixpkgs";
		# most recent commit as of 11/13/23
		rev = "bb142a6838c823a2cd8235e1d0dd3641e7dcfd63";
		hash = "sha256:0nbicig1zps3sbk7krhznay73nxr049hgpwyl57qnrbb0byzq9iy";
	}) {};

in pkgs.mkShell {
	buildInputs = with pkgs; [
        # Setup Deno and other web stuff
        deno
	];
}
```

Don't worry about syntax for now; just know that this file is essentially setting up the Nix environment and installing any necessary developer tools or technologies. **Though, I highly recommend taking time to learn it**.

## Install Nix Environment Selector for VSCode

> If you've followed the alternative approach mentioned earlier in the first step, you may not need to install it. **Double-check to make sure it's installed!**

Install [the extension here](https://marketplace.visualstudio.com/items?itemName=arrterian.nix-env-selector) and select `shell.nix` as your environment in the command palette using the `Nix-Env: Select Environment` command.

Wait for the extension to build it and restart VSCode afterwards.

You successfully integrated Nix with VSCode! Congrats!

Start taking time to learn Nix and implement it in your new or current project to speed up the onboarding processes for new developers who'll work on your project.

## References

1. NixOS slides made by [Diamond](https://github.com/diamondburned): <https://nix.libdb.so/slides>
2. Nix Environment Selector: <https://marketplace.visualstudio.com/items?itemName=arrterian.nix-env-selector>
