import { withFallback } from "@/lib/client/fallback";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { HomeIcon } from "~/common/ui/icon";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace HomeLink {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps">>,
			MarkSuspense.Props {
		//
	}
}

export const HomeLink = withFallback(
	({ _suspense, ...props }: HomeLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"go home"}
				{...uiMenuButton({})}
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
				{...uiMenuButton({})}
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
