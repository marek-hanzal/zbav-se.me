# flow

Here are pages running on fullscreen without bottom nav. Be careful about
what you place here as the user _may be_ confused with navigation being hidden.

## Note

When flow route files become large, prefer moving reusable UI/state pieces into `apps/app/src/app/*` domain components and keep route files focused on loader/navigation composition.

Flow route `data-ui` selectors must follow the bracketed contract:
- Root: `Component[Element]`
- Child: `Component-[Element]`
- Qualifier: `Component[Element.state]` or `Component-[Element.state]`

Recent split example:
- `buyer/feed/$id/favourite/list.tsx` keeps route orchestration only, while empty/appendix status UI lives in `apps/app/src/app/@buyer-user/feed-favourite/ui/*`.
- `buyer/feed/$id/list.tsx` keeps loader/navigation only, while page composition moved to `apps/app/src/app/@buyer-user/feed/page/FeedListPage.tsx`.
