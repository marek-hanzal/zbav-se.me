# TODO

## Feed & User Experience
- Fresh listing - generate feed, collect filters
    - Also keep the option to skip and "just browse" with defaults ?

- Generate user-specific feed based on filter he set's up
    - something like Feed table + endpoint; favourite listing could be marked in this feed

- Listing -> connect to /api/listing/feed
    - Everytime user finishes the feed, he can create a new one
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

- When I know user's favourite groups/categories, I can fetch them _before_ the other ones (+ e.g. button "show all" to display/fetch remaining)

- Marking favourite users (sellers) + info about that
- When listing is saved, recompute user's "favourite" category list

- if the user opens listing from feed, mark all "previous" listings as "viewed" and start from the viewed onwards

## User Management & Auth
- Prompt user to use passkey?
- Allow anonymous user + test its flow (check if there is isAnonym flag)

- Map tiles + cache on CDN is allowed (+ attribution in UI)
    - We can connect CDN pullzone directly to maptiles with API key

- When deploying hit endpoint to mark deployment (eventually also disable clients)
    - When done, prompt to reload

- Add endpoint to purge old files from storages
- Resolve /null get calls from TSR/TSS
- Resolve why fuckin' webglob is not forwarding mails

- Add app-level env. check in github action (e.g. simple script validating env. schemas)

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
