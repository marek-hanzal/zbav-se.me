import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { useMaybeUpload } from "~/common/gallery/hook/useMaybeUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { CheckIcon } from "~/common/ui/icon";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { withListingValidationQuery } from "~/seller/listing/query/withListingValidationQuery";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		draft: DraftSchema.Type;
	}
}

export const Item: FC<Item.Props> = ({ _suspense, draft, ...props }) => {
	const { data: valid } = withListingValidationQuery.useSuspenseQuery({
		draftId: draft.id,
	});

	const locale = useLocale();
	const hero = useMaybeUpload(draft.withImageUrl);

	return (
		<LinkTo
			to={"/$locale/app/seller/draft/$id/edit"}
			params={{
				locale,
				id: draft.id,
			}}
		>
			<ListItem
				hero={hero}
				title={
					<Tx
						label={draft.title ?? "Draft (label)"}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="lead"
						data-ui-font="semibold"
						data-ui-text="sm"
						data-ui-display="block"
						data-ui-width="full"
						data-ui-truncate
						className={[
							"block",
							"w-full",
							"max-w-full",
							"min-w-0",
						]}
					/>
				}
				bottom={
					<Typo
						label={toTimeDiff({
							locale,
							time: draft.updatedAt,
						})}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-text="xs"
						data-ui-font="normal"
						data-ui-color="text"
						data-ui-opacity="5"
					/>
				}
				{...props}
			>
				{valid.success ? (
					<Container
						data-ui-tone="primary"
						data-ui-theme="light"
						data-ui-round="full"
						data-ui-background="default"
						data-ui-snap-to="bottom-left"
						data-ui-flow="vertical"
						data-ui-items="center"
						data-ui-justify="center"
						data-ui-opacity="8"
						data-ui-shadow
						data-ui-border
						className={[
							"h-7",
							"w-7",
						]}
					>
						<Icon
							icon={CheckIcon}
							data-ui-tone={"primary"}
							data-ui-theme="light"
							data-ui-text="lg"
							data-ui-color="lead"
						/>
					</Container>
				) : null}
			</ListItem>
		</LinkTo>
	);
};
