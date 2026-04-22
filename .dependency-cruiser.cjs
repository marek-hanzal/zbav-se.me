/** @type {import('dependency-cruiser').IForbiddenRuleType[]} */
const rules = [
	{
		name: "lib-client-from-common",
		comment: "Do not import lib client stuff from common",
		severity: "error",
		from: {
			path: "^lib/common(/|$)",
		},
		to: {
			path: "^lib/client(/|$)",
		},
	},
	{
		name: "lib-server-from-common",
		comment: "Do not import lib server stuff from common",
		severity: "error",
		from: {
			path: "^lib/common(/|$)",
		},
		to: {
			path: "^lib/server(/|$)",
		},
	},
	{
		name: "lib-client-from-server",
		comment: "Do not import lib client stuff from server",
		severity: "error",
		from: {
			path: "^lib/server(/|$)",
		},
		to: {
			path: "^lib/client(/|$)",
		},
	},
	{
		name: "lib-server-from-client",
		comment: "Do not import lib server stuff from client",
		severity: "error",
		from: {
			path: "^lib/client(/|$)",
		},
		to: {
			path: "^lib/server(/|$)",
		},
	},
	{
		name: "seller-from-buyer",
		comment: "Do not import seller stuff from buyer",
		severity: "error",
		from: {
			path: "^src/buyer(/|$)",
		},
		to: {
			path: "^src/seller(/|$)",
		},
	},
	{
		name: "buyer-from-seller",
		comment: "Do not import buyer stuff from seller",
		severity: "error",
		from: {
			path: "^src/seller(/|$)",
		},
		to: {
			path: "^src/buyer(/|$)",
		},
	},
	{
		name: "buyer-from-common",
		comment: "Do not import buyer stuff from common",
		severity: "error",
		from: {
			path: "^src/common(/|$)",
		},
		to: {
			path: "^src/buyer(/|$)",
		},
	},
	{
		name: "seller-from-common",
		comment: "Do not import seller stuff from common",
		severity: "error",
		from: {
			path: "^src/common(/|$)",
		},
		to: {
			path: "^src/seller(/|$)",
		},
	},
	{
		name: "user-from-public",
		comment: "Do not import user stuff from public",
		severity: "error",
		from: {
			path: "^src/public(/|$)",
		},
		to: {
			path: "^src/user(/|$)",
		},
	},
	{
		name: "no-server-imports",
		comment: "Do not import server internals outside the approved server surface",
		severity: "error",
		from: {
			pathNot: [
				"^src/start\\.ts$",
				"^src/@routes(?:/|$)",
				"^src/server(?:/|$)",
				"^src/[^/]+/server(?:/|$)",
				"^src/[^/]+/[^/]+/server(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/server(?:/|$)",
				"^src/[^/]+/middleware(?:/|$)",
				"^src/[^/]+/[^/]+/middleware(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/middleware(?:/|$)",
				"^src/[^/]+/fn(?:/|$)",
				"^src/[^/]+/[^/]+/fn(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/fn(?:/|$)",
				"^src/[^/]+/tool(?:/|$)",
				"^src/[^/]+/[^/]+/tool(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/tool(?:/|$)",
			],
		},
		to: {
			path: [
				"^src/server(?:/|$)",
				"^src/[^/]+/server(?:/|$)",
				"^src/[^/]+/[^/]+/server(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/server(?:/|$)",
			],
			pathNot: [
				"^src/server/(?:fn|schema)(?:/|$)",
				"^src/[^/]+/server/(?:fn|schema)(?:/|$)",
				"^src/[^/]+/[^/]+/server/(?:fn|schema)(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/server/(?:fn|schema)(?:/|$)",
				"^src/[^/]+/fn(?:/|$)",
				"^src/[^/]+/[^/]+/fn(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/fn(?:/|$)",
				"^src/[^/]+/tool(?:/|$)",
				"^src/[^/]+/[^/]+/tool(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/tool(?:/|$)",
				"^src/[^/]+/middleware(?:/|$)",
				"^src/[^/]+/[^/]+/middleware(?:/|$)",
				"^src/[^/]+/[^/]+/[^/]+/middleware(?:/|$)",
			],
			dependencyTypesNot: [
				"type-only",
			],
		},
	},
];

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		// {
		// 	name: "no-circular",
		// 	severity: "error",
		// 	comment:
		// 		"This dependency is part of a circular relationship. You might want to revise " +
		// 		"your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
		// 	from: {
		//     },
		// 	to: {
		// 		circular: true,
		// 	},
		// },
		{
			name: "no-orphans",
			comment:
				"This is an orphan module - it's likely not used (anymore?). Either use it or " +
				"remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
				"add an exception for it in your dependency-cruiser configuration. By default " +
				"this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration " +
				"files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
			severity: "error",
			from: {
				orphan: true,
				pathNot: [
					"(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$", // dot files
					"[.]d[.]ts$", // TypeScript declaration files
					"(^|/)tsconfig[.]json$", // TypeScript config
					"(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$", // other configs
				],
			},
			to: {},
		},
		{
			name: "not-to-deprecated",
			comment:
				"This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later " +
				"version of that module, or find an alternative. Deprecated modules are a security risk.",
			severity: "warn",
			from: {},
			to: {
				dependencyTypes: [
					"deprecated",
				],
			},
		},
		{
			name: "no-non-package-json",
			severity: "error",
			comment:
				"This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
				"That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
				"available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
				"in your package.json.",
			from: {},
			to: {
				dependencyTypes: [
					"npm-no-pkg",
					"npm-unknown",
				],
			},
		},
		{
			name: "not-to-unresolvable",
			comment:
				"This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
				"module: add it to your package.json. In all other cases you likely already know what to do.",
			severity: "error",
			from: {},
			to: {
				couldNotResolve: true,
			},
		},
		{
			name: "no-duplicate-dep-types",
			comment:
				"Likely this module depends on an external ('npm') package that occurs more than once " +
				"in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
				"maintenance problems later on.",
			severity: "warn",
			from: {},
			to: {
				moreThanOneDependencyType: true,
				dependencyTypesNot: [
					"type-only",
				],
			},
		},

		// rules you might want to tweak for your specific situation:
		{
			name: "not-to-test",
			comment:
				"This module depends on code within a folder that should only contain tests. As tests don't " +
				"implement functionality this is odd. Either you're writing a test outside the test folder " +
				"or there's something in the test folder that isn't a test.",
			severity: "error",
			from: {
				pathNot: "^(test)",
			},
			to: {
				path: "^(test)",
			},
		},
		{
			name: "not-to-spec",
			comment:
				"This module depends on a spec (test) file. The responsibility of a spec file is to test code. " +
				"If there's something in a spec that's of use to other modules, it doesn't have that single " +
				"responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.",
			severity: "error",
			from: {},
			to: {
				path: "[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$",
			},
		},
		{
			name: "not-to-dev-dep",
			severity: "error",
			comment:
				"This module depends on an npm package from the 'devDependencies' section of your " +
				"package.json. It looks like something that ships to production, though. To prevent problems " +
				"with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
				"section of your package.json. If this module is development only - add it to the " +
				"from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration",
			from: {
				path: "^(src)",
				pathNot: "[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$",
			},
			to: {
				dependencyTypes: [
					"npm-dev",
				],
				dependencyTypesNot: [
					"type-only",
				],
				pathNot: [
					"node_modules/@types/",
				],
			},
		},
		{
			name: "optional-deps-used",
			severity: "info",
			comment:
				"This module depends on an npm package that is declared as an optional dependency " +
				"in your package.json. As this makes sense in limited situations only, it's flagged here. " +
				"If you use an optional dependency here by design - add an exception to your" +
				"dependency-cruiser configuration.",
			from: {},
			to: {
				dependencyTypes: [
					"npm-optional",
				],
			},
		},
		{
			name: "peer-deps-used",
			comment:
				"This module depends on an npm package that is declared as a peer dependency " +
				"in your package.json. This makes sense if your package is e.g. a plugin, but in " +
				"other cases - maybe not so much. If the use of a peer dependency is intentional " +
				"add an exception to your dependency-cruiser configuration.",
			severity: "warn",
			from: {},
			to: {
				dependencyTypes: [
					"npm-peer",
				],
			},
		},
		...rules,
	],
	options: {
		doNotFollow: {
			path: [
				"node_modules",
			],
		},
		detectProcessBuiltinModuleCalls: true,
		prefix: `vscode://file/${process.cwd()}/`,
		tsPreCompilationDeps: true,
		tsConfig: {
			fileName: "tsconfig.json",
		},

		enhancedResolveOptions: {
			exportsFields: [
				"exports",
			],
			conditionNames: [
				"import",
				"require",
				"node",
				"default",
				"types",
			],
			mainFields: [
				"module",
				"main",
				"types",
				"typings",
			],
		},
		skipAnalysisNotInRules: true,
		reporterOptions: {
			dot: {
				collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",
			},
			archi: {
				collapsePattern:
					"^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)",
			},
			text: {
				highlightFocused: true,
			},
		},
	},
};
