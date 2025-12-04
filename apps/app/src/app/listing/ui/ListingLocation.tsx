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
	className = [],
	...props
}) => {
	return (
		<Badge
			ui={"ListingLocation-root"}
			tone={"secondary"}
			theme={"light"}
			round={"default"}
			className={[
				"flex",
				"flex-col",
				"h-fit",
				"py-2",
				"gap-0",
			]}
			{...props}
		>
			{location}

			{children}
		</Badge>
	);
};
