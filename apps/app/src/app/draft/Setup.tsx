import { useQueryClient } from "@tanstack/react-query";
import { SaveIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { View } from "@use-pico/client/ui/view";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { CreateListingButton } from "~/app/draft/button/CreateListingButton";
import { DeleteButton } from "~/app/draft/button/DeleteButton";
import { AgePatch } from "~/app/draft/patch/AgePatch";
import { CategoryPatch } from "~/app/draft/patch/CategoryPatch";
import { ConditionPatch } from "~/app/draft/patch/ConditionPatch";
import { ExpireAtPatch } from "~/app/draft/patch/ExpireAtPatch";
import { GalleryPatch } from "~/app/draft/patch/GalleryPatch";
import { LocationPatch } from "~/app/draft/patch/LocationPatch";
import { PricePatch } from "~/app/draft/patch/PricePatch";
import { TitlePatch } from "~/app/draft/patch/TitlePatch";
import { AgeValue } from "~/app/draft/value/AgeValue";
import { CategoryValue } from "~/app/draft/value/CategoryValue";
import { ConditionValue } from "~/app/draft/value/ConditionValue";
import { ExpireAtValue } from "~/app/draft/value/ExpireAtValue";
import { LocationValue } from "~/app/draft/value/LocationValue";
import { PriceValue } from "~/app/draft/value/PriceValue";
import { TitleValue } from "~/app/draft/value/TitleValue";
import { GalleryValue } from "~/app/gallery/ui/GalleryValue";

export namespace Setup {
	export type View =
		| "default"
		| "title"
		| "location"
		| "price"
		| "category"
		| "condition"
		| "age"
		| "gallery"
		| "expireAt";

	export interface Props {
		locale: string;
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
	}
}

export const Setup: FC<Setup.Props> = ({ locale, draft, onListing, onDelete }) => {
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
									inner: "default",
									width: "full",
									gap: "lg",
								}}
							>
								<GalleryValue
									uploads={draft.gallery.items.map((item) => item.upload)}
									onClick={() => setView("gallery")}
								/>

								<TitleValue
									draft={draft}
									onClick={() => {
										setView("title");
									}}
								/>

								<CategoryValue
									draft={draft}
									onClick={() => {
										setView("category");
									}}
								/>

								<LocationValue
									draft={draft}
									onClick={() => {
										setView("location");
									}}
								/>

								<PriceValue
									draft={draft}
									locale={locale}
									onClick={() => {
										setView("price");
									}}
								/>

								<ConditionValue
									draft={draft}
									onClick={() => {
										setView("condition");
									}}
								/>

								<AgeValue
									draft={draft}
									onClick={() => {
										setView("age");
									}}
								/>

								<ExpireAtValue
									draft={draft}
									onClick={() => {
										setView("expireAt");
									}}
								/>

								<CreateListingButton
									draft={draft}
									onListing={onListing}
								/>

								<LinkTo
									to={"/$locale/ui/seller"}
									params={{
										locale,
									}}
									icon={SaveIcon}
									iconProps={{
										ui: {
											text: "2xl",
										},
									}}
									{...uiButton({
										ui: {
											inner: "md",
											text: "lg",
										},
										className: [],
									})}
								>
									<Container
										ui={{
											flow: "vertical",
											height: "full",
										}}
									>
										<Tx label="Close draft (button)" />

										<Tx
											label="Close draft (hint)"
											ui={{
												text: "xs",
												color: "icon",
											}}
										/>
									</Container>
								</LinkTo>

								<DeleteButton
									draft={draft}
									onDelete={onDelete}
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
				gallery: {
					children: (
						<GalleryPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSuccess={() => setView("default")}
							defaultUploadIds={draft.gallery.items.map((item) => item.uploadId)}
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
