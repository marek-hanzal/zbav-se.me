import { EditIcon, Icon } from "@use-pico/client/icon";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { View } from "@use-pico/client/ui/view";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tDraftPatch } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { LocationControl } from "~/app/location/ui/LocationControl";
import { LocationValue } from "~/app/location/ui/LocationValue";

export namespace Setup {
	export type View = "default" | "location";

	export interface Props {
		locale: string;
		draft: tDraft;
	}
}

export const Setup: FC<Setup.Props> = ({ locale, draft }) => {
	const [view, setView] = useState<Setup.View>("default");
	const [patch, setPatch] = useState<tDraftPatch>({
		patch: draft,
		query: {
			where: {
				id: draft.id,
			},
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
									locationId={patch.patch.locationId}
									onClick={() => {
										setView("location");
									}}
								/>
							</Container>
						</TitleContainer>
					),
				},
				location: {
					children: (
						<TitleContainer textTitle={"Listing location (title)"}>
							<LocationControl
								locale={locale}
								onCancel={() => setView("default")}
								onSave={({ locationId }) => {
									setPatch((prev) => ({
										...prev,
										patch: {
											...prev.patch,
											locationId,
										},
									}));
									setView("default");
								}}
								ui={{
									inner: "default",
								}}
							/>
						</TitleContainer>
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
