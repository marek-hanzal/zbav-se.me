import type { FC } from "react";
import { Badge } from "@/lib/client/badge";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export namespace LocationBadge {
	export interface Props extends Badge.Props {
		location: LocationSchema.Type;
		distance: number | null | undefined;
	}
}

/**
 * Displays location in a compact badge form with emphasized visual treatment.
 * Use it in list rows or cards where location needs quick scanning.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const LocationBadge: FC<LocationBadge.Props> = ({
	location,
	distance,
	children,
	className,
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
