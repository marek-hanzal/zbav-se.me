import { HomeIcon } from "~/application-ui/constant/icon.exports";
import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace HomeLink {
	export interface Props
		extends uiLinkToFn.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const HomeLink = withFallbackFn(
	({ _suspense, ...props }: HomeLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"go home"}
				{...uiMenuButtonFn({})}
				icon={HomeIcon}
				to="/$locale/app/home"
				params={{
					locale,
				}}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Tx label="Home (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<HomeLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"go home"}
				{...uiMenuButtonFn({})}
				icon={HomeIcon}
				to="/$locale/app/home"
				params={{
					locale,
				}}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
