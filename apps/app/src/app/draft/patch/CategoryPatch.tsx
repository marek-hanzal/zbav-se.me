import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { CategorySelect } from "~/app/category/ui/CategorySelect";
import { SaveControl } from "~/app/control/SaveControl";

export namespace CategoryPatch {
	export interface Props extends TitleContainer.Props {
		locale: string;
		draft: tDraft;
		onCancel(): void;
		onSave(categoryId: string | null): void;
		loading: boolean;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({
	locale,
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: draft.categoryId
			? [
					{
						id: draft.categoryId,
					},
				]
			: [],
	});

	const categoryId = selection.optional.singleId() ?? null;

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.category]"}
			textTitle={"Listing category (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					gap: "default",
					inner: "default",
				}}
			>
				<CategorySelect
					locale={locale}
					selection={selection}
					categoryId={categoryId ?? undefined}
				/>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(categoryId);
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};
