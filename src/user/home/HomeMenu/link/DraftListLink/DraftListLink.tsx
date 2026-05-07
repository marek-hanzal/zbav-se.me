import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { DraftIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace DraftListLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const DraftListLink = withFallback(
	({ _suspense, ...props }: DraftListLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open draft list"}
				{...uiMenuButton({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
					<Tx label={"Draft list (label)"} />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<DraftListLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open draft list"}
				{...uiMenuButton({})}
				icon={DraftIcon}
				to="/$locale/app/seller/draft/list"
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
