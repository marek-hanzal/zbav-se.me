import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { EditIcon, Icon, UserIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { TokenUsage } from "~/user/agent/ui/TokenUsage";
import { useUser } from "~/user/auth/hook/useUser";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { SignOutButton } from "~/user/profile/UserPage/SignOutButton";
import { withUserRestrictionQuery } from "~/user/user-restriction/query/withUserRestrictionQuery";
import type { UserRestrictionSchema } from "~/user/user-restriction/server/schema/UserRestrictionSchema";
import { RestrictionSheet } from "./RestrictionSheet";

export namespace UserPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Composes the route-level user screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the user journey.
 *
 * @see src/@routes
 */
export const UserPage: FC<UserPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const user = useUser();
	const restrictionMutation = withUserRestrictionQuery.useCreateMutation({
		invalidate: [
			"collection",
		],
	});
	const {
		data: [restriction],
	} = withUserRestrictionQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
			{
				field: "availableAt",
				order: "desc",
			},
		],
	});
	const [isRestriction, setIsRestriction] = useState(false);

	return (
		<TitleContainer
			data-ui={"User[TitleContainer]"}
			textTitle={translator.text("User profile (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			data-ui-layout="vertical-header-content"
			{...props}
		>
			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
				data-ui-inner={"default"}
				data-ui-scroll={"vertical"}
				data-ui-height={"full"}
			>
				<Status
					data-ui-tone={"brand"}
					data-ui-theme={"light"}
					icon={UserIcon}
				/>

				<Group>
					<LabelValue
						textLabel={translator.text("User email (label)")}
						textHint={translator.text("User email (hint)")}
						textValue={user.email}
					/>
				</Group>

				<Group>
					{}
					<ValueList
						textLabel={translator.text("User restriction level (label)")}
						textHint={translator.text("User restriction level (hint)")}
						textEmpty={translator.text("User restriction level (empty)")}
						items={[
							restriction,
						].filter((item): item is UserRestrictionSchema.Type => !!item)}
						renderFn={(restriction) => {
							return (
								<Container
									data-ui-flow={"vertical"}
									data-ui-gap={"xs"}
									data-ui-width={"full"}
								>
									<Tx
										label={`Listing restriction - ${restriction.restriction}`}
										data-ui-font={"bold"}
									/>

									{restriction.availableAt &&
									restriction.availableAt > new Date() ? (
										<Container
											data-ui-flow={"horizontal"}
											data-ui-justify={"space-between"}
											data-ui-items={"center"}
										>
											<Tx
												label={"Restriction available in (label)"}
												data-ui-text={"sm"}
											/>

											<Typo
												label={toTimeDiff({
													type: "human",
													locale,
													source: restriction.createdAt.toISOString(),
													time: restriction.availableAt,
												})}
												data-ui-tone={"brand"}
												data-ui-theme={"light"}
												data-ui-color={"lead"}
												data-ui-font={"bold"}
												data-ui-text={"sm"}
												data-ui-opacity={"8"}
											/>
										</Container>
									) : null}
								</Container>
							);
						}}
						action={
							<Icon
								icon={EditIcon}
								data-ui-text={"lg"}
								onClick={() => {
									setIsRestriction((open) => !open);
								}}
							/>
						}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel={translator.text("Token usage (label)")}
						textHint={translator.text("Token usage (hint)")}
						textValue={<TokenUsage data-ui-justify={"start"} />}
					/>
				</Group>

				<Group>
					<SignOutButton data-ui-width={"full"} />
				</Group>
			</Container>

			<RestrictionSheet
				isOpen={isRestriction}
				onClose={() => {
					setIsRestriction(false);
				}}
				restriction={restriction?.restriction}
				onRestriction={async (restriction) => {
					return restrictionMutation.mutateAsync({
						restriction,
					});
				}}
				isPending={restrictionMutation.isPending}
			/>
		</TitleContainer>
	);
};
