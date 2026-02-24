import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { CreateListingButton } from "~/app/@seller-user/draft/ui/button/CreateListingButton";
import { DeleteButton } from "~/app/@seller-user/draft/ui/button/DeleteButton";

export namespace ActionSection {
	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
	}
}

export const ActionSection: FC<ActionSection.Props> = ({ draft, onListing, onDelete }) => {
	const locale = useLocale();

	return (
		<>
			<Tx
				label={translator.text("Draft - action section (title)")}
				ui={{
					tone: "neutral",
					theme: "light",
					text: "md",
					color: "lead",
					opacity: "low",
				}}
				className={"text-center"}
			/>

			<Group>
				<CreateListingButton
					draft={draft}
					onListing={onListing}
					ui={{
						round: undefined,
						shadow: false,
						inner: "lg",
					}}
				/>

				<LinkTo
					to={"/$locale/flow/home"}
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
						<Tx label={translator.text("Close draft (button)")} />

						<Tx
							label={translator.text("Close draft (hint)")}
							ui={{
								text: "xs",
								color: "icon",
							}}
						/>
					</Container>
				</LinkTo>

				<DeleteButton
					draft={draft}
					onDelete={onDelete}
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
