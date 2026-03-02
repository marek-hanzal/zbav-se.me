import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { PlusIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import type { FC } from "react";

export namespace CreateButton {
	export interface Props extends Button.Props {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ ui, className, ...props }) => {
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
			iconEnabled={PlusIcon}
			iconLoading={SpinnerIcon}
			iconProps={{
				ui: {
					text: "2xl",
					opacity: "4",
				},
			}}
			ui={{
				tone: "neutral",
				theme: "light",
				flow: "vertical",
				items: "center",
				inner: "default",
				color: "lead",
				font: "semibold",
				text: "lg",
				...ui,
			}}
			className={[
				className,
				"shrink-0",
			]}
			{...props}
		>
			<Tx label={"Create new draft (title)"} />
		</Button>
	);
};
