import { useLocale } from "@use-pico/client/hook";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tLocation } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace LocationBadge {
	export interface Props extends Badge.Props {
		location: tLocation;
		distance: number | null | undefined;
	}
}

/**
 * Displays location in a compact badge form with emphasized visual treatment.
 * Use it in list rows or cards where location needs quick scanning.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const LocationBadge: FC<LocationBadge.Props> = ({
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
			data-ui={"LocationBadge"}
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
