import type { RcFile } from "syncpack";

export default {
	sortPackages: true,
	sortFirst: [
		"name",
		"description",
		"version",
		"type",
		"sideEffects",
		"scripts",
		"dependencies",
		"peerDependencies",
		"devDependencies",
		"trustedDependencies",
		"main",
		"module",
		"types",
		"files",
		"exports",
		"author",
		"license",
		"repository",
		"homepage",
		"bugs",
	],
	sortAz: [
		"dependencies",
		"devDependencies",
		"peerDependencies",
		"trustedDependencies",
		"keywords",
	],
	versionGroups: [
		{
			label: "Workspace",
			packages: [
				"**",
			],
			dependencies: [
				"$LOCAL",
			],
			pinVersion: "workspace:*",
		},
	],
	semverGroups: [
		{
			label: "Current Version",
			range: "",
		},
	],
} satisfies RcFile;
