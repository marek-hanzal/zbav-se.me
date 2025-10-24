# TODO

## Listing Features
- Extract create listing Wrappers into standalone components as they will serve as "inputs" for search or displaying listing detail
- Allow video? - how to store + process + display?
- Allow moving/switching neighbor photos (new controls -> new bar with controls and trash icon)
- Select multiple photos
- Post process photos - remove metadata -> or use Bunny optimizer (which can do this on delivery)

- Extend listing of
    - price - exchange/for free
    - shipping - post/personal/...
    - availability from (... this one?)
    - store amount (multiple instances on a single listing?)

- Add expireAt on listing (drop DB again :()
    - Add listing duration in listing creation
- Add auction switch on a listing (PRO feature)
- Mark listing near the expiration (from the server?)

- Add ability to make a discount on listing + show the new price + allow search for discounts
- Interactive button on listing detail for "Instant buy"
    - this will move to chat with default (randomized) message "I would like to buy the thing"

## Feed & User Experience
- Fresh listing - generate feed, collect filters
    - Also keep the option to skip and "just browse" with defaults ?

- Generate user-specific feed based on filter he set's up
    - something like Feed table + endpoint; favourite listing could be marked in this feed

- Listing -> connect to /api/listing/feed
    - every time user finishes the feed, he can create a new one
    - Because we know feed creation datetime, we can sell this info to buyers as data

- Listing watch time - after a timeout send (using a queue) watch increase
    - learn from skipped listings? - e.g. wrong category/price/whatever - build internal "interest" score of the user

- Likes in feed counts likeness score on listing
    - category; overriding each other depending on what was clicked and when

- Show hot info on feed (ListingPreview) - combo of
    - listing score (bags + feed presence)
    - seller score

- Calculate score of listing - hotness
    - how many users has the thing in the bag
    - how many times the thing is in the feed of an user

- When I know user's favourite groups/categories, I can fetch them _before_ the other ones (+ e.g. button "show all" to
    display/fetch remaining)

- Marking favourite users (sellers) + info about that
- When listing is saved, recompute user's "favourite" category list

## User Management & Auth
- Prompt user to use passkey?
- Allow anonymous user + test its flow (check if there is isAnonym flag)

## Monetization & Subscriptions
- Stripe DEV
- Stripe + dev/testing
- Create Tiers (plans) for users to define limits a user has
    - Number of submitted photos
    - Number of categories
    - If the user can see additional info when choosing category groups + categories (expand on category + pay coins)

- Go by subscription model with quotas - update ToS accommodate this

- When redirecting from native mobile app use email/push notification with link to login in browser to pay less in the zbm shop

## Integrations
- Integrate Packeta
    - with this we can hide user details, so nobody can know each other (fully secure/anonymous)

## UI/UX Improvements
- Animate location search result
- A11y is quite an important thing
- When there is a locale without groups, show a page with "market" redirect
    - Status with "Market not available yet in your country" ?

## Technical Infrastructure
- _Fix infinite scroll; 0.5 threshold is low -> change to static pixels_

- Move availableCurrencies to "common" package for client and server
    - _validate currency on server_
- Revisit currencies, it's not the best thing how
- ListingPreview - price inline has hardcoded currency code

- Maybe it would be necessary to strip userId's from backend output
    - Also content server stores files in /<id> - unpredictable, but initial part may be readable?

- Map tiles + cache on CDN is allowed (+ attribution in UI)
    - We can connect CDN pullzone directly to maptiles with API key

- When deploying hit endpoint to mark deployment (eventually also disable clients)
    - When done, prompt to reload

- Add endpoint to purge old files from storages
- Resolve /null get calls from TSR/TSS
- Resolve why fuckin' webglob is not forwarding mails

## Development & Deployment
- Staging (-> dev)
- MCP
- Test capacitor + native app build

- Create README
    - Merge with ENV.md
    - Describe tech stack
    - Keep costs estimated (based on stack) for different MAU user groups (e.g. 10k/100k/500k)

## Interesting stuff

> This one _must_ be implemented!
> https://github.com/rhinobase/hono-rate-limiter

https://github.com/ktkongtong/hono-geo-middleware/tree/main/packages/middleware
