![Dashbordy Logo](/src/assets/img/git-banner.jpg)

An Angular interface to create, read, update and delete Firestore users implemented using primeNG UI components.

## About the project

Dashbordy is one of my personal pet projects developed in Angular, using Firebase as a backend and deployed on Heroku.
The main scope of the project was to implement and design a single page application to perform common CRUD operations on Firestore users documents.
It was also a mean to further build my Angular knowledge and get familiar with new environments like [PrimeNG](https://github.com/primefaces/primeng) and SCSS.

## Firestore

The users are stored on Firebase in a collection of documents. The ID of every document refers to their respective UID in the the Firebase Authentication database.

![firestore model](/src/assets/img/firestore.jpg)

## Angular

The Angular application comes with a login page to prevent unauthorised read and writes. Make sure to modify your Firebase security rules to allow users with an admin role.
![login page](/src/assets/img/login.jpg)

The columns can be sorted and the input box will filter the search results on matching name, email or city.
![table view](/src/assets/img/table.jpg)

A modal window to create new users or edit existing ones.
![modal window](/src/assets/img/user.jpg)

## Heroku

To prevent sharing Firebase API key and ID's on a public repository, the `setEnv.ts` script will generate them before the build command and production deployement using evironment variables from Heroku.

in package.json:

```
"config": "ts-node ./src/assets/scripts/setEnv.ts"
"build": "npm run config -- --environment=prod && ng build --prod"
```

## Requirements

To locally build and run an Angular project, you will have to setup the development environements which requires the Angular CLI and a compatible Node.js version.

First follow the instructions on [nodejs.org](https://nodejs.org/en/download/) to install Node.js on your operating system.

You can then use the npm package manager that comes with Node.js to install the Angular CLI.

`npm install -g @angular/cli`

This project was first generated using [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Clone the repository

`git clone https://github.com/ordy/ng-dashbordy`

Instructions if you need to install git: [git-scm](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Building the project

In your cookingdom directory, run:

`npm install`

This will fetch all the required dependencies from package.json to run the application.

## Run a development server

Run `npm start` to run the app on a local dev server. Then navigate to `http://localhost:4200/` to load the app. The page will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Make sure to set `autoWatch: false, singleRun: true` in karma.conf.js if you are going to run the tests on a Continous Itergration service.
