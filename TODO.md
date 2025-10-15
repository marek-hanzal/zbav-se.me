# TODO

- Edit snapper - value & edit
- Render categories as tiles

- Create Listing -> fullscreen, reserve bottom for progress, so it won't block page
- Experiment with classic scroll for categories, items 1/3 or 1/4 of height
- Prompt user to use passkey?
- Allow anonymous user + test it's flow (check if there is isAnonym flag)
- User registration - for now, we'll use email + password, da old-school (find auth lib, GPT knows)
- When listing is saved, recompute user's "favourite" category list
- Use Fuse.js for category search: feed will be combo of category group - category, already translated (this will probably need useQuery)
- Fix "Submit" page of create listing - Maybe use Snapper with overview what a user has selected (this looks like quite a good idea)
    - Submit button _must_ be visible all the times to prevent slowing user down 
- Create Tiers (plans) for users to define limits an user have
    - Number of submitted photos
    - Number of categories
    - If the user can see additional info when choosing category groups + categories (expand on category + pay coins)
- "Enforce" flow in listing creation - instead of "hasPhotos" and co. create an array with items "valid", e.g. valid = ["photos", "category"] and so on
    - When showing a page, check, what's missing and display proper message based on this
        - Maybe show only one at a time (first missing); for this we've to have required items and valid and compare them to get what's missing
- In list where appropriate prepend card (so default index will be 1 instead of 0) with search
    - After search, switch to next card which may contain results/no-result message
- Resolve translations as it's now quite big P.I.T.A to have keys only and translations in a file
- Create Spotlight in database which will index language versions of different items, so we'll be able to search server-side through DB (e.g. localized search
    for something in category list instead of using fuse); it would be also possible to eventually return localized strings directly from server instead of
    pure keys
