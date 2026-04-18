import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { CreateListingButton } from "../button/CreateListingButton";
import { DeleteButton } from "../button/DeleteButton";

export namespace ActionSection {
	export interface Props {
		draft: DraftSchema.Type;
	}
}

export const ActionSection: FC<ActionSection.Props> = ({ draft }) => {
	const locale = useLocale();

	return (
		<>
			<Tx
				label="Draft - action section (title)"
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Group>
				<CreateListingButton
					draft={draft}
					data-ui-round={undefined}
					data-ui-shadow={false}
					data-ui-inner="lg"
				/>

				<LinkTo
					to={"/$locale/app/home"}
					params={{
						locale,
					}}
					icon={"icon-[solar--alarm-linear]"}
					iconProps={{
						"data-ui-text": "2xl",
					}}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-inner="lg"
					data-ui-background="default"
					data-ui-border={false}
					data-ui-shadow={false}
				>
					<Container
						data-ui-flow="vertical"
						data-ui-height="full"
					>
						<Tx label="Close draft (button)" />

						<Tx
							label="Close draft (hint)"
							data-ui-text="xs"
							data-ui-color="icon"
						/>
					</Container>
				</LinkTo>

				<DeleteButton
					draft={draft}
					buttonProps={{
						"data-ui-round": undefined,
						"data-ui-border": false,
						"data-ui-shadow": false,
						"data-ui-inner": "lg",
					}}
					confirmProps={{
						"data-ui-round": undefined,
						"data-ui-shadow": false,
						"data-ui-border": false,
						"data-ui-inner": "lg",
					}}
				/>
			</Group>
		</>
	);
};
