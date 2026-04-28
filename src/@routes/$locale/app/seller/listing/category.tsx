import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { useSelection } from "@/lib/client/selection";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { CategorySelect } from "~/user/category/ui/CategorySelect";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";

export const Route = createFileRoute("/$locale/app/seller/listing/category")({
	component() {
		const locale = useLocale();
		const navigate = useNavigate();
		const mutation = withListingQuery.useCreateMutation({
			onPostMutation({ result }) {
				return navigate({
					to: "/$locale/app/seller/listing/$id/edit",
					params: {
						id: result.id,
						locale,
					},
				});
			},
			invalidate: [
				"collection",
				"count",
			],
		});
		const selection = useSelection({
			mode: "single",
		});

		return (
			<TitleContainer
				textTitle={translator.text("Select listing category (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
					data-ui-inner={"default"}
					data-ui-height={"full"}
				>
					<CategorySelect
						selection={selection}
						categoryId={undefined}
						withRestriction={true}
					/>

					<Group>
						<CurrentRestriction _suspense={"I know"} />
					</Group>

					<SaveContainer
						onCancel={() => {
							return navigate({
								to: "/$locale/app/home",
								params: {
									locale,
								},
							});
						}}
						onSave={() => {
							mutation.mutate({
								categoryId: selection.required.singleId(),
							});
						}}
						textSave={translator.text("Continue to listing (label)")}
						loading={mutation.isPending}
						disabled={mutation.isPending || !selection.hasAny}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
