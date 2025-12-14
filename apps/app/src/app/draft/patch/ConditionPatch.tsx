import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { ConditionSelect } from "~/app/condition/ui/ConditionSelect";
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
					inner: "default",
				}}
			>
				<ConditionSelect selection={selection} />

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(condition);
					}}
					loading={loading}
					disabled={!condition}
				/>
			</Container>
		</TitleContainer>
	);
};
