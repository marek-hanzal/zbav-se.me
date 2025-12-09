import { Badge } from "@use-pico/client/ui/badge";
import type { FC } from "react";

export namespace ListingLocation {
	export interface Props extends Badge.Props {
		location: string;
	}
}

export const ListingLocation: FC<ListingLocation.Props> = ({
	location,
	children,
	className,
	ui,
	...props
}) => {
	return (
		<Badge
			data-ui={"ListingLocation-root"}
			className={[
				"flex flex-col h-fit py-2 gap-0",
				className,
			]}
			ui={{
				tone: "secondary",
				theme: "light",
				round: "default",
				...ui,
			}}
			{...props}
		>
			{location}

			{children}
		</Badge>
	);
};
