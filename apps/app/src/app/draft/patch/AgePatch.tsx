import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/age/ui/AgeSelection";
import { SaveControl } from "~/app/control/SaveControl";

export namespace AgePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(age: number | null): void;
		loading: boolean;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ draft, onCancel, onSave, loading, ...props }) => {
	const selection = useSelection<Rating.RatingItem>({
		mode: "single",
		initial: draft.age
			? [
					{
						id: String(draft.age),
					},
				]
			: [],
	});

	const itemId = selection.optional.singleId();
	const age = itemId ? Number.parseInt(itemId, 10) : null;

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.age]"}
			textTitle={"Age (title)"}
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
				<AgeSelection selection={selection} />

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(age);
					}}
					loading={loading}
					disabled={!age}
				/>
			</Container>
		</TitleContainer>
	);
};
