import { useQueryClient } from "@tanstack/react-query";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Status } from "@use-pico/client/ui/status";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingIcon, PhotoIcon } from "@zbav-se.me/ui/icon";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import { type FC, useState } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { AgePatch } from "~/app/draft/patch/AgePatch";
import { CategoryPatch } from "~/app/draft/patch/CategoryPatch";
import { ConditionPatch } from "~/app/draft/patch/ConditionPatch";
import { ExpireAtPatch } from "~/app/draft/patch/ExpireAtPatch";
import { LocationPatch } from "~/app/draft/patch/LocationPatch";
import { PricePatch } from "~/app/draft/patch/PricePatch";
import { TitlePatch } from "~/app/draft/patch/TitlePatch";
import { LocationValue } from "~/app/location/ui/LocationValue";

export namespace Setup {
	export type View =
		| "default"
		| "title"
		| "location"
		| "price"
		| "category"
		| "condition"
		| "age"
		| "expireAt";

	export interface Props {
		locale: string;
		draft: tDraft;
	}
}

export const Setup: FC<Setup.Props> = ({ locale, draft }) => {
	const queryClient = useQueryClient();
	const [view, setView] = useState<Setup.View>("default");
	const mutation = withDraftPatchMutation.useMutation({
		async onSuccess() {
			await withDraftFetchQuery.invalidate(queryClient, {
				where: {
					id: draft.id,
				},
			});
			setView("default");
		},
	});

	return (
		<View<Setup.View, TitleContainer.Props>
			state={{
				value: view,
				set: setView,
			}}
			views={{
				default: {
					children: (
						<TitleContainer textTitle={"Draft edit (title)"}>
							<Container
								data-ui={"Setup-[Container.content]"}
								ui={{
									flow: "vertical",
									gap: "default",
									inner: "default",
									width: "full",
								}}
							>
								<Container
									data-ui={"Setup-[Container.placeholder]"}
									ui={{
										tone: "neutral",
										theme: "light",
										round: "md",
										width: "full",
										flow: "horizontal",
										items: "center",
										justify: "center",
										background: "default",
										shadow: true,
										border: true,
									}}
									className="h-42"
								>
									<Status
										data-ui={"Setup-[Status.photo-hint]"}
										icon={PhotoIcon}
										iconProps={{
											ui: {
												text: "3xl",
											},
										}}
										textTitle={"Listing photo gallery (label)"}
										titleProps={{
											ui: {
												font: "normal",
												text: "lg",
											},
										}}
										ui={{
											tone:
												(draft.gallery?.items.length ?? 0) > 0
													? "neutral"
													: "primary",
											theme: "light",
											text: "default",
										}}
									/>
								</Container>

								<LabelValue
									wrapperProps={{
										ui: {
											tone: draft.title ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Listing title (label)")}
									textValue={draft.title ?? null}
									textEmpty={translator.text("Listing title not filled")}
									onClick={() => {
										setView("title");
									}}
								/>

								<LabelValue
									wrapperProps={{
										ui: {
											tone: draft.category ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Listing category (label)")}
									textValue={
										draft.category ? (
											<CategoryInline
												category={draft.category}
												tone="secondary"
												theme="light"
											/>
										) : null
									}
									textEmpty={translator.text("Listing category not selected")}
									onClick={() => {
										setView("category");
									}}
								/>

								<LocationValue
									wrapperProps={{
										ui: {
											tone: draft.locationId ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Listing location (label)")}
									textEmpty={translator.text("Listing location not selected")}
									textHint={translator.text("Listing location (hint)")}
									locationId={draft.locationId}
									onClick={() => {
										setView("location");
									}}
								/>

								<LabelValue
									wrapperProps={{
										ui: {
											tone:
												draft.price && draft.currency
													? "neutral"
													: "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Price (title)")}
									textValue={
										draft.price && draft.currency ? (
											<PriceInline
												price={draft.price}
												locale={locale}
												currency={draft.currency}
											/>
										) : null
									}
									textEmpty={translator.text("Price not set")}
									onClick={() => {
										setView("price");
									}}
								/>

								<LabelValue
									wrapperProps={{
										ui: {
											tone: draft.condition ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Listing condition (label)")}
									textValue={
										draft.condition
											? translator.text(
													`Condition - Overall [${draft.condition}] (hint)`,
												)
											: null
									}
									textEmpty={translator.text("Condition not selected")}
									onClick={() => {
										setView("condition");
									}}
								/>

								<LabelValue
									wrapperProps={{
										ui: {
											tone: draft.age ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Listing age (label)")}
									textValue={
										draft.age
											? translator.text(
													`Condition - Age [${draft.age}] (hint)`,
												)
											: null
									}
									textEmpty={translator.text("Age not selected")}
									textHint={translator.text("Listing age (hint)")}
									onClick={() => {
										setView("age");
									}}
								/>

								<LabelValue
									wrapperProps={{
										ui: {
											tone: draft.expiresAt ? "neutral" : "primary",
										},
									}}
									action={
										<Icon
											icon={EditIcon}
											ui={{
												text: "xl",
											}}
										/>
									}
									textLabel={translator.text("Expire (title)")}
									textValue={
										draft.expiresAt ? `Expire in ${draft.expiresAt}` : null
									}
									textEmpty={translator.text("Expiration date not set")}
									textHint={translator.text("Draft expire (hint)")}
									onClick={() => {
										setView("expireAt");
									}}
								/>

								<Button
									iconEnabled={ListingIcon}
									iconProps={{
										ui: {
											text: "2xl",
										},
									}}
									label={"Submit listing (button)"}
									{...uiSaveButton({
										className: [],
									})}
								/>
							</Container>
						</TitleContainer>
					),
				},
				title: {
					children: (
						<TitlePatch
							loading={mutation.isPending}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(title) => {
								mutation.mutate({
									patch: {
										title,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				location: {
					children: (
						<LocationPatch
							loading={mutation.isPending}
							locale={locale}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(locationId) => {
								mutation.mutate({
									patch: {
										locationId,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				price: {
					children: (
						<PricePatch
							loading={mutation.isPending}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(price) => {
								mutation.mutate({
									patch: {
										price,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				category: {
					children: (
						<CategoryPatch
							loading={mutation.isPending}
							locale={locale}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(categoryId) => {
								mutation.mutate({
									patch: {
										categoryId,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				condition: {
					children: (
						<ConditionPatch
							loading={mutation.isPending}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(condition) => {
								mutation.mutate({
									patch: {
										condition,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				age: {
					children: (
						<AgePatch
							loading={mutation.isPending}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(age) => {
								mutation.mutate({
									patch: {
										age,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
				expireAt: {
					children: (
						<ExpireAtPatch
							loading={mutation.isPending}
							draft={draft}
							onCancel={() => setView("default")}
							onSave={(expiresAt) => {
								mutation.mutate({
									patch: {
										expiresAt,
									},
									query: {
										where: {
											id: draft.id,
										},
									},
								});
							}}
						/>
					),
				},
			}}
		>
			{({ scrollRef, content }) => {
				return (
					<Container
						data-ui={"Setup[Container]"}
						ref={scrollRef}
						ui={{
							scroll: "vertical",
							height: "full",
						}}
					>
						{content}
					</Container>
				);
			}}
		</View>
	);
};
