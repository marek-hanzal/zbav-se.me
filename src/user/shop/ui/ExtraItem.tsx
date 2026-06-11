import type { FC, KeyboardEvent } from "react";
import { useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import type { ExtraSchema } from "~/user/stripe/server/schema/ExtraSchema";
import { ExtraSheet } from "./ExtraSheet";

export namespace ExtraItem {
	export interface Props extends Group.Props {
		bundle: ExtraSchema.Type;
	}
}

export const ExtraItem: FC<ExtraItem.Props> = ({ bundle, className, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);
	const open = () => {
		setIsOpen(true);
	};

	const openByKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		open();
	};

	return (
		<>
			<Group
				data-ui="ExtraItem"
				data-resource-bundle={bundle.bundle}
				data-ui-bundle={bundle.bundle}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				data-ui-border={true}
				data-ui-inner="lg"
				role="button"
				tabIndex={0}
				className={[
					"cursor-pointer",
					className,
				]}
				onClick={open}
				onKeyDown={openByKeyboard}
				{...props}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="sm"
					data-ui-width="full"
				>
					<Container
						data-ui-flow="horizontal"
						data-ui-items="start"
						data-ui-justify="space-between"
						data-ui-gap="default"
						data-ui-width="full"
					>
						<Typo
							label={bundle.name}
							preset="subheader"
						/>

						<Typo
							label={
								<PriceInline
									price={bundle.price / 100}
									locale={locale}
									currency={bundle.currency.toUpperCase()}
								/>
							}
							data-ui-font="bold"
						/>
					</Container>

					<Container
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-justify="space-between"
						data-ui-gap="default"
						data-ui-width="full"
					>
						<Typo
							label={bundle.description}
							data-ui-opacity="7"
							data-ui-text="sm"
							className="line-clamp-3"
						/>

						<Icon
							icon={ChevronRightIcon}
							data-ui-text="xl"
							data-ui-color="lead"
							className="shrink-0"
						/>
					</Container>

					<Typo
						label={translator.text("See the extra detail (label)")}
						data-ui-color="lead"
						data-ui-font="bold"
						data-ui-text="sm"
					/>
				</Container>
			</Group>

			<ExtraSheet
				bundle={bundle}
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
			/>
		</>
	);
};
