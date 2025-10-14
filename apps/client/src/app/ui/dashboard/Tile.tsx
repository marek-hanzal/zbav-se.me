import { Status } from "@use-pico/client";
import { useCls, VariantProvider } from "@use-pico/cls";
import type { FC } from "react";
import { TileCls } from "~/app/ui/dashboard/TileCls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export namespace Tile {
	export interface Props extends TileCls.Props<Status.Props> {}
}

export const Tile: FC<Tile.Props> = ({ cls = TileCls, tweak, ...props }) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "secondary",
					theme: "light",
				}}
			>
				<Status
					titleProps={{
						size: "xl",
						tweak: {
							slot: {
								root: {
									class: [
										"text-wrap",
									],
								},
							},
						},
					}}
					messageProps={{
						size: "sm",
						tweak: {
							slot: {
								root: {
									class: [
										"text-wrap",
									],
								},
							},
						},
					}}
					{...props}
				/>
			</VariantProvider>
		</div>
	);
};
