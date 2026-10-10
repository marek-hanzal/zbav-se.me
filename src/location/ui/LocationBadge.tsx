import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { Badge } from "~/ui/ui/Badge";
import { Container } from "~/ui/ui/Container";

export namespace LocationBadge {
	export interface Props extends Badge.Props {
		location: LocationSchema.Type;
		distance: number | null | undefined;
	}
}

/**
 * Displays location in a compact badge form with emphasized visual treatment.
 * Use it in list rows or cards where location needs quick scanning.
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
			data-ui-tone="secondary"
			data-ui-theme="light"
			data-ui-size="md"
			data-ui-color="lead"
			data-ui-font="semibold"
			{...props}
		>
			<Container
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="space-between"
				data-ui-gap="default"
			>
				<Container>{location.address}</Container>
				{distance ? (
					<Container>
						{toLocaleNumberFn({
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
