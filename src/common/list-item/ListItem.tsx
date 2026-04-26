import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import { isString } from "@/lib/common/is-string";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import { Image } from "./Image";

export namespace ListItem {
	export type Hero = UploadSchema.Type | ReactNode | undefined | null;

	export interface Props extends Omit<Group.Props, "title"> {
		hero: Hero;
		title: ReactNode;
		bottom: ReactNode;
	}

	export type PropsEx = Partial<Props>;
}

export const ListItem: FC<ListItem.Props> = ({
	hero,
	title,
	bottom,
	className,
	children,
	...props
}) => {
	const image: ReactNode =
		hero == null ? (
			<Image />
		) : isString(hero) ? (
			<Image src={hero} />
		) : (
			<Container
				className={"aspect-square h-full shrink-0 overflow-hidden"}
				data-ui-tone="subtle"
				data-ui-theme="light"
				data-ui-round="md"
				data-ui-height="full"
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="center"
				data-ui-background="default"
			>
				{hero as ReactNode}
			</Container>
		);

	return (
		<Group
			data-ui={"ListItem"}
			className={[
				"min-h-26",
				"h-26",
				"md:h-28",
				"shrink-0",
				"relative",
				className,
			]}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-width="full"
			data-ui-background="default"
			{...props}
		>
			<Container
				data-ui-flow="horizontal"
				data-ui-position="relative"
				data-ui-height="full"
				data-ui-width="full"
			>
				{image}

				<Container
					className={"min-w-0 flex-1"}
					data-ui-flow="vertical"
					data-ui-items="start"
					data-ui-justify="space-between"
					data-ui-height="full"
					data-ui-inner="xs"
					data-ui-width="full"
				>
					{title}

					{bottom}
				</Container>

				<Icon
					icon={ChevronRightIcon}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-snap-to="right-center"
					data-ui-text="xl"
					data-ui-color="lead"
				/>

				{children}
			</Container>
		</Group>
	);
};
