# Getting Started:

Make sure to have Node.js and NPM installed. Download it [here](https://nodejs.org/en/) and select the LTS option.

# To Setup the Project For Local Use:

1. In the directory where you want the project, run `git clone https://github.com/CityDevsCCNY/GradSchoolZero`
2. Goto the project directory (ie: `cd ./GradSchoolZero` in the same terminal as we've installed the project)
3. Run `npm i` (shorthand for `npm install`) to install all dependencies required by the project

# To Run the Project Locally:

We require 2 different terminals to be open and to be in the project's directory (in `...\GradSchoolZero`) for both of these:

1. In one of the terminals terminal, run: `npm start` (starts the react project)
2. In the other terminal, run: `npm run serve` (starts the database server the react project uses)

> **Note:** There may be some issues with using this project in macOS as we discovered later on related to the database calls made by this system [there may be some sort of limitation in macOS not seen in Windows as it works fine in Windows (we're not sure if running Windows via Bootcamp in macOS will yield the same problems)].
