import { useSnapperNav } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { SnapperNav } from "@use-pico/client/ui/snapper-nav";
import type { StateType } from "@use-pico/common/type";
import { type FC, useRef } from "react";
import { PhotoUpload } from "~/app/v0/@common/photo/ui/PhotoUpload";

export namespace GalleryUpload {
	export interface Props extends Container.Props {
		state: StateType.State<string[]>;
		limit: number;
	}
}

export const GalleryUpload: FC<GalleryUpload.Props> = ({ state, limit, ...props }) => {
	const snapperRef = useRef<HTMLDivElement>(null);

	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: limit,
	});

	return (
		<Container
			data-ui={"GalleryUpload-[Container]"}
			ui={{
				position: "relative",
				height: "full",
			}}
			{...props}
		>
			<SnapperNav
				data-ui={"GalleryUpload-[SnapperNav]"}
				snapperNav={snapperNav}
			/>

			<Container
				data-ui={"GalleryUpload-[Container.photos]"}
				ref={snapperRef}
				ui={{
					layout: "horizontal-full",
					snap: "horizontal",
					snapAlign: "center",
					gap: "default",
					height: "full",
					round: "default",
				}}
			>
				{Array.from({
					length: limit,
				}).map((_, slot) => {
					const disabled = slot > 0 && !state.value[slot - 1];

					return (
						<PhotoUpload
							key={`${slot + 1}`}
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
							ui={{
								disabled,
							}}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
