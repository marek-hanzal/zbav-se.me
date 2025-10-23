# TODO

- Stripe DEV
- ListingPreview - price inline has hardcoded currency code
- Mark listing near the expiration (from the server?)

- _Fix infinite scroll; 0.5 threshold is low -> change to static pixels_

- Move availableCurrencies to "common" package for client and server
    - _validate currency on server_
- Add expireAt on listing (drop DB again :()
    - Add listing duration in listing creation
- Add auction switch on a listing (PRO feature)
- Stripe + dev/testing

- Generate user-specific feed based on filter he set's up
    - something like Feed table + endpoint; favourite listing could be marked in this feed
- Maybe it would be necessary to strip userId's from backend output
    - Also content server stores files in /<id> - unpredictable, but initial part may be readable?
- Map tiles + cache on CDN is allowed (+ attribution in UI)
    - We can connect CDN pullzone directly to maptiles with API key
- A11y is quite an important thing
- Create README
    - Merge with ENV.md
    - Describe tech stack
    - Keep costs estimated (based on stack) for different MAU user groups (e.g. 10k/100k/500k)

- When there is a locale without groups, show a page with "market" redirect
    - Status with "Market not available yet in your country" ?

- Revisit currencies, it's not the best thing how

- Staging (-> dev)
- MCP

- Animate location searh result
- Test capacitor + native app build

- When deploying hit endpoint to mark deployment (eventually also disable clients)
    - When done, prompt to reload

- Resolve why fuckin' webglob is not forwarding mails
- Add endpoint to purge old files from storages
- Post process photos - remove metadata -> or use Bunny optimizer (which can do this on delivery)

- Resolve /null get calls from TSR/TSS

- When I know user's favourite groups/categories, I can fetch them _before_ the other ones (+ e.g. button "show all" to
    display/fetch remaining)

- Prompt user to use passkey?
- Allow anonymous user + test it's flow (check if there is isAnonym flag)
- When listing is saved, recompute user's "favourite" category list
- Create Tiers (plans) for users to define limits an user have
    - Number of submitted photos
    - Number of categories
    - If the user can see additional info when choosing category groups + categories (expand on category + pay coins)

- Go by subscription model with quotas - update ToS accomodate this

## Interesting stuff

> This one _must_ be implemented!
> https://github.com/rhinobase/hono-rate-limiter

https://github.com/ktkongtong/hono-geo-middleware/tree/main/packages/middleware
