import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
	title: "Zbav se mě - Blog",
	tagline: "Podívej se nejen do zákulisí vývoje nejlepšího c2c tržiště!",
	favicon: "img/favicon.ico",

	future: {
		v4: true,
	},

	url: "https://blog.zbav-se.me",

	baseUrl: "/",

	organizationName: "marek-hanzal",
	projectName: "zbav-se.me",

	onBrokenLinks: "throw",

	i18n: {
		defaultLocale: "cs",
		locales: [
			"cs",
		],
	},

	presets: [
		[
			"classic",
			{
				docs: false,
				pages: false,
				blog: {
					blogTitle: "Zbav se mě",
					blogDescription: "Podívej se nejen do zákulisí vývoje nejlepšího c2c tržiště!",
					blogSidebarTitle: "Články",
					showReadingTime: true,
					feedOptions: {
						type: [
							"rss",
							"atom",
						],
						xslt: true,
					},
					routeBasePath: "/",
					editUrl: "https://github.com/marek-hanzal/zbav-se.me/tree/main/apps/blog",
					//
					onInlineTags: "warn",
					onInlineAuthors: "warn",
					onUntruncatedBlogPosts: "warn",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		image: "img/docusaurus-social-card.jpg",
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "zbav-se.me",
			hideOnScroll: true,
			// style: "primary",
		},
		blog: {
			sidebar: {
				groupByYear: true,
			},
		},
		footer: {
			style: "dark",
			copyright: `Copyright © ${new Date().getFullYear()} zbav-se.me`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
