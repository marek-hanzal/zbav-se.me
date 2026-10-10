import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { getFeedDefaultCreate } from "~/buyer-feed/service/getFeedDefaultCreate";
import { SearchEditor } from "~/buyer-search/ui/SearchEditor";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { translator } from "~/translation/fn/translator";
import { useTranslator } from "~/translation/hook/useTranslator";
import { withTranslationsQuery } from "~/translation/query/withTranslationsQuery";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/search")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const t = translator({
			translations: await withTranslationsQuery.ensure(queryClient, {
				locale,
			}),
		});

		return (
			(await withFeedQuery
				.ensureEntityQuery(queryClient, {
					where: {
						type: "search",
					},
					sort: [
						{
							field: "updatedAt",
							order: "desc",
						},
					],
				})
				.catch(() => undefined)) ??
			(await withFeedQuery.createFn(
				queryClient,
				getFeedDefaultCreate(t.text("Search (title)"), "search"),
			))
		);
	},
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"Search[TitleContainer.pending]"}
				textTitle={translator.text("Search (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				data-ui-layout="vertical-header-content"
				right={<HomeMenuButton />}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const translator = useTranslator();
		const locale = useLocale();
		const {
			data: { id: feedId },
		} = withFeedQuery.useEntityQuery({
			where: {
				type: "search",
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		});

		return (
			<TitleContainer
				data-ui={"Search[TitleContainer]"}
				textTitle={translator.text("Search (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				data-ui-layout="vertical-header-content"
				right={<HomeMenuButton />}
			>
				<SearchEditor
					_suspense={"I know"}
					feedId={feedId}
				/>
			</TitleContainer>
		);
	},
});
