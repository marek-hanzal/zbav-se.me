import { SaveIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/user";
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
	const [view, setView] = useState<Setup.View>("default");

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
									label={translator.text("Listing photo gallery (label)")}
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
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				location: {
					children: (
						<LocationPatch
							locale={locale}
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				price: {
					children: (
						<PricePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				category: {
					children: (
						<CategoryPatch
							locale={locale}
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				condition: {
					children: (
						<ConditionPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				age: {
					children: (
						<AgePatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
						/>
					),
				},
				expireAt: {
					children: (
						<ExpireAtPatch
							draft={draft}
							onCancel={() => setView("default")}
							onSettled={() => setView("default")}
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
