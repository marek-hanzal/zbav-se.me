import { useLocale } from "@use-pico/client/hook";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace ListingLocation {
	export interface Props extends Badge.Props {
		location: tLocation;
		distance: number | null | undefined;
	}
}

export const ListingLocation: FC<ListingLocation.Props> = ({
	location,
	distance,
	children,
	className,
	ui,
	...props
}) => {
	const locale = useLocale();

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
				size: "md",
				color: "lead",
				font: "semibold",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					flow: "horizontal",
					items: "center",
					justify: "space-between",
					gap: "default",
				}}
			>
				<Container>{location.address}</Container>
				{distance ? (
					<Container>
						{toLocaleNumber({
							locale,
							number: distance,
							maximumFractionDigits: 1,
						})}
						km
					</Container>
				) : null}
			</Container>

			{children}
		</Badge>
	);
};
