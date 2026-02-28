import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { PlusIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { FC } from "react";

export namespace CreateButton {
	export interface Props extends Button.Props {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ ui, ...props }) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const draftCreateMutation = withDraftQuery.useCreateMutation({
		async onPostMutation({ result }) {
			await navigate({
				to: "/$locale/seller/draft/$id/edit",
				params: {
					locale,
					id: result.id,
				},
			});
		},
		invalidate: [
			"collection",
		],
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
					opacity: "6",
				}}
			>
				<Status
					icon={draftCreateMutation.isPending ? SpinnerIcon : PlusIcon}
					textTitle={translator.text("Create new draft (title)")}
				/>
			</Container>
		</Button>
	);
};
