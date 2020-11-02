## Project Name & Pitch

APOD

An application used to preview Nasa's Astronomy picture of the day based on the selected date, built with React, Redux, Firebase, Typescript and SCSS.

## Project Features

- User can get picture of the day based on the selected date.
- User can add picture of the day to favorite list
- User can delete a favorite picture of the day from the favorite list
- User can delete all favorite pictures of the day.
- User can preview favorited picture of the day
- User can hover on the previous an next button to have a sneak peak of the previous/next picture of the day.
- User can access their favorited list on different devices.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm/yarn` installed globally on your machine. You will also need to create a firebase account to get your configuration keys.

Installation:

`yarn install`

Update an .env file and update:

`Use .env.example file as a guide`

To Run Test Suite:

`npm test`

To Start Server:

`yarn start`

To Visit App:

`localhost:3000`

## Reflection

This was a 3 day project built as an assessment for PartnerHero. Project goals included using technologies such as firebase to persist favorited pictures of the day.

I started this process by using the `create-react-app` boilerplate with `typescript`, then adding `redux` and `firebase`.

## Deployment

This application is deployed with `Netlify` and it is live [here](https://apod-mc.netlify.app/)
