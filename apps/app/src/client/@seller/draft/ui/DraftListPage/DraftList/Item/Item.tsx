import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import { isValid } from "~/client/@common/draft/util/isValid";
import { useMaybeUpload } from "~/client/@common/gallery/hook/useMaybeUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		draftId: string;
	}
}

export const Item = withFallback(
	({ _suspense, draftId, ...props }: Item.Props) => {
		const { data: draft } = withDraftQuery.useFetchQuery(draftId);

		const locale = useLocale();
		const hero = useMaybeUpload(draft.gallery.items);

		const valid = isValid(draft);

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
							ui={{
								tone: "neutral",
								theme: "light",
								color: "lead",
								font: "semibold",
								text: "sm",
								display: "block",
								width: "full",
								truncate: true,
							}}
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
							ui={{
								tone: "neutral",
								theme: "light",
								text: "xs",
								font: "normal",
								color: "text",
								opacity: "5",
							}}
						/>
					}
					{...props}
				>
					{valid.isValid ? (
						<Container
							ui={{
								tone: "primary",
								theme: "light",
								round: "full",
								background: "default",
								snapTo: "bottom-left",
								flow: "vertical",
								items: "center",
								justify: "center",
								opacity: "8",
								shadow: true,
								border: true,
							}}
							className={[
								"h-7",
								"w-7",
							]}
						>
							<Icon
								icon={CheckIcon}
								ui={{
									tone: valid.isValid ? "primary" : "secondary",
									theme: "light",
									text: "lg",
									color: "lead",
								}}
							/>
						</Container>
					) : null}
				</ListItem>
			</LinkTo>
		);
	},
	(props: SpinnerContainer.Props) => {
		return (
			<SpinnerContainer
				data-ui="DraftList-[SpinnerContainer]"
				type="icon"
				{...props}
			/>
		);
	},
);
