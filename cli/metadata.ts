// Adds metadata to each markdown file within /content/post/**/.md

// TODO: Add register (ex. Register[0x0001]) to each markdown file
// Need to add register based on publish date.
// Will also add publish date if not there.
//
// This feels like a LeetCode type of problem, lol

import fs from "fs";
import { Metadata } from "./types";

const contentPath = "src/content/post";

// Used the almighty, all powerful ChatGPT to generate the regex
const regex = /---(.*?)---/s;

// Update metadata for each post
const updatePostMetadata = (): void => {
	const posts = getDirectories(contentPath);
	posts.forEach((post) => {
		// index.md contains the main content in each post directory
		const postPath = `${contentPath}/${post}/index.md`;
		const postContent = fs.readFileSync(postPath, "utf-8");
		const metaData = getCurrentMetaData(postContent);
		console.log(metaData);

		// work more on the algorithm
		// ...
	});
};

const getDirectories = (dir: string): string[] => {
	if (!fs.existsSync(dir)) {
		throw new Error(`Directory does not exist: ${dir}`);
	}
	return fs.readdirSync(dir);
};

const readFile = (path: string): string => {
	if (!fs.existsSync(path)) {
		throw new Error(`File does not exist: ${path}`);
	}
	return fs.readFileSync(path, "utf-8");
};

const getCurrentMetaData = (postContent: string): string => {
	const match = postContent.match(regex);
	if (!match) {
		return "No metadata found.";
	}

	// Get specific attributes from metadata
	// ...

	return match[1];
};

updatePostMetadata();
