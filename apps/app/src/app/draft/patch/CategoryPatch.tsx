import { useSelection } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
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
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Listing category (title)"}
						action={
							<Suspense fallback={<SpinnerContainer />}>
								<CategorySelect
									locale={locale}
									selection={selection}
									categoryId={categoryId ?? undefined}
								/>
							</Suspense>
						}
					>
						<Mx
							label={"Listing category (required)"}
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
						onSave(categoryId);
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};
