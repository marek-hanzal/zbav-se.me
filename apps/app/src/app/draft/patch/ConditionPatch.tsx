import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { ConditionContainer } from "~/app/condition/ui/ConditionContainer";
import { SaveControl } from "~/app/control/SaveControl";

export namespace ConditionPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(condition: number | null): void;
		loading: boolean;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const selection = useSelection<Rating.RatingItem>({
		mode: "single",
		initial:
			draft.condition !== null && draft.condition !== undefined
				? [
						{
							id: String(draft.condition),
						},
					]
				: [],
	});

	const itemId = selection.optional.singleId();
	const condition = itemId ? Number.parseInt(itemId, 10) : null;

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.condition]"}
			textTitle={"Condition (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Condition (title)"}
						action={<ConditionContainer selection={selection} />}
					>
						<Mx
							label={"Condition (required)"}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Status>
				</Container>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(condition);
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};
