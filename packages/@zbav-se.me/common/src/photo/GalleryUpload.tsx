import { useSnapperNav } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { SnapperNav } from "@use-pico/client/ui/snapper-nav";
import type { StateType } from "@use-pico/common/type";
import { type FC, useId, useRef } from "react";
import { PhotoUpload } from "./PhotoUpload";

export namespace GalleryUpload {
	export interface Props extends Container.Props {
		state: StateType.State<string[]>;
		limit: number;
	}
}

export const GalleryUpload: FC<GalleryUpload.Props> = ({ state, limit, ...props }) => {
	const uploadRootId = useId();
	const snapperRef = useRef<HTMLDivElement>(null);

	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: limit,
	});

	return (
		<Container
			ui={"GalleryUpload-root"}
			position={"relative"}
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<SnapperNav
				snapperNav={snapperNav}
				orientation={"horizontal"}
				iconProps={() => ({
					size: "sm",
				})}
				tweak={{
					slot: {
						root: {
							class: [
								"bottom-1",
								"transition-opacity",
								state.value.length > 0 ? "opacity-60" : "opacity-0",
							],
						},
					},
				}}
				subtle={false}
			/>

			<Container
				ref={snapperRef}
				layout="horizontal-full"
				snap={"horizontal-start"}
				gap={"md"}
				round={"default"}
			>
				{Array.from({
					length: limit,
				}).map((_, slot) => {
					const disabled = slot > 0 && !state.value[slot - 1];

					return (
						<PhotoUpload
							key={`${uploadRootId}-${slot + 1}`}
							disabled={disabled}
							value={state.value[slot]}
							onChange={(uploadId) => {
								state.set((prev) => {
									const next: (string | undefined)[] = [
										...prev,
									];
									next[slot] = uploadId;

									const compact: string[] = next.filter((f): f is string => !!f);

									return compact;
								});
							}}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
