import { useQueryClient } from "@tanstack/react-query";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { LocationPatch } from "~/app/draft/patch/LocationPatch";
import { TitlePatch } from "~/app/draft/patch/TitlePatch";
import { LocationValue } from "~/app/location/ui/LocationValue";

export namespace Setup {
	export type View = "default" | "title" | "location";

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
											tone: "primary",
											theme: "light",
											text: "default",
										}}
									/>
								</Container>

								<LabelValue
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

								<LocationValue
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
