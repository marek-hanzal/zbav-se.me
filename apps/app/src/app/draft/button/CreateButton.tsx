import { PlusIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftCreateMutation } from "@zbav-se.me/sdk/mutation/user/draft";
import type { FC } from "react";

export namespace CreateButton {
	export interface Props extends Button.Props {
		onSuccess?(draft: tDraft): void;
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ onSuccess, ui, ...props }) => {
	const draftCreateMutation = withDraftCreateMutation.useMutation({
		onSuccess(data) {
			onSuccess?.(data);
		},
	});

	return (
		<Button
			data-ui={"DraftCreateButton[Button]"}
			onClick={() => {
				draftCreateMutation.mutate({});
			}}
			disabled={draftCreateMutation.isPending}
			loading={draftCreateMutation.isPending}
			iconLoading={null}
			ui={{
				tone: "neutral",
				theme: "light",
				round: "lg",
				width: "full",
				size: undefined,
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					tone: "neutral",
					theme: "light",
					width: "full",
					height: "full",
					round: "lg",
					flow: "horizontal",
					items: "center",
					justify: "center",
					background: "default",
					position: "relative",
					opacity: "medium",
				}}
			>
				<Status
					icon={draftCreateMutation.isPending ? SpinnerIcon : PlusIcon}
					textTitle="Create new draft (title)"
				/>
			</Container>
		</Button>
	);
};
