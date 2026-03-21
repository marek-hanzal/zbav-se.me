import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { CreateListingButton } from "../button/CreateListingButton";
import { DeleteButton } from "../button/DeleteButton";

export namespace ActionSection {
	export interface Props {
		draft: tDraft;
	}
}

export const ActionSection: FC<ActionSection.Props> = ({ draft }) => {
	const locale = useLocale();

	return (
		<>
			<Tx
				label="Draft - action section (title)"
				ui={{
					tone: "neutral",
					theme: "light",
					text: "md",
					color: "lead",
					opacity: "8",
				}}
				className={"text-center"}
			/>

			<Group>
				<CreateListingButton
					draft={draft}
					ui={{
						round: undefined,
						shadow: false,
						inner: "lg",
					}}
				/>

				<LinkTo
					to={"/$locale/app/home"}
					params={{
						locale,
					}}
					icon={"icon-[solar--alarm-linear]"}
					iconProps={{
						ui: {
							text: "2xl",
						},
					}}
					ui={{
						tone: "neutral",
						theme: "light",
						inner: "lg",
						background: "default",
						border: false,
						shadow: false,
					}}
				>
					<Container
						ui={{
							flow: "vertical",
							height: "full",
						}}
					>
						<Tx label="Close draft (button)" />

						<Tx
							label="Close draft (hint)"
							ui={{
								text: "xs",
								color: "icon",
							}}
						/>
					</Container>
				</LinkTo>

				<DeleteButton
					draft={draft}
					buttonProps={{
						ui: {
							round: undefined,
							border: false,
							shadow: false,
							inner: "lg",
						},
					}}
					confirmProps={{
						ui: {
							round: undefined,
							shadow: false,
							border: false,
							inner: "lg",
						},
					}}
				/>
			</Group>
		</>
	);
};
