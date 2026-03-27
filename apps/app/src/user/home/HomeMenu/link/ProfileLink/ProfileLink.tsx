import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, UserIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";

export namespace ProfileLink {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const ProfileLink = withFallback(
	({ _suspense, ...props }: ProfileLink.Props) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open profile"}
				{...uiMenuButton({
					className: [],
				})}
				icon={UserIcon}
				to="/$locale/app/user"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					ui: {
						tone: "primary",
						theme: "light",
					},
					className: [],
				})}
				{...uiMenuButton({
					ui: {
						tone: "neutral",
						theme: "light",
					},
					className: [],
				})}
				{...props}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						ui: {
							opacity: "5",
						},
					}}
				>
					<Tx label="My profile (label)" />
				</TypoIcon>
			</LinkTo>
		);
	},
	(props: Omit<ProfileLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open profile"}
				{...uiMenuButton({
					className: [],
				})}
				icon={UserIcon}
				to="/$locale/app/user"
				params={{
					locale,
				}}
				activeProps={uiMenuButton({
					ui: {
						tone: "primary",
						theme: "light",
					},
					className: [],
				})}
				{...props}
			>
				<Tx label={"Loading... (label)"} />
			</LinkTo>
		);
	},
);
