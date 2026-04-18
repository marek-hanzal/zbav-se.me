import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { FindListingsIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace SearchLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const SearchLink = withFallback(
	({ _suspense, ...props }: SearchLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"search listings"}
				{...uiMenuButton({})}
				icon={FindListingsIcon}
				to="/$locale/app/buyer/search"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButton({
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
				})}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Tx label="Find listings (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<SearchLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"search listings"}
				{...uiMenuButton({})}
				icon={FindListingsIcon}
				to="/$locale/app/buyer/search"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
