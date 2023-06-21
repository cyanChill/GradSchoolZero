# Getting Started:

Make sure to have Node.js and NPM installed. Download it [here](https://nodejs.org/en/) and select the LTS option.

## Demo

https://github.com/cyanChill/GradSchoolZero/assets/83375816/2192523a-597f-4ab2-8cfe-a4c45c024868


# To Setup the Project For Local Use:

1. In the directory where you want the project, run `git clone https://github.com/CityDevsCCNY/GradSchoolZero`
2. Goto the project directory (ie: `cd ./GradSchoolZero` in the same terminal as we've installed the project)
3. Run `npm i` (shorthand for `npm install`) to install all dependencies required by the project

# To Run the Project Locally:

We require 2 different terminals to be open and to be in the project's directory (in `...\GradSchoolZero`) for both of these:

1. In one of the terminals, run: `npm start` (starts the react project)
2. In the other terminal, run: `npm run serve` (starts the database server the react project uses)

> **Note:** There may be some issues with using this project in macOS as we discovered later on related to the database calls made by this system [there may be some sort of limitation in macOS not seen in Windows as it works fine in Windows (we're not sure if running Windows via Bootcamp in macOS will yield the same problems)].

# Some Users:

You can see the full list of users with email & password in the `db.json` file [look in the "users" property in this JSON object]

1. **Registrar** [Type Registrar]

   ```
       email: registrar@gradschoolzero.edu
       password: password
   ```

2. **George Simon** [Type Instructor]

   ```
       email: gsimon@gradschoolzero.edu
       password: password
   ```

3. **David Ifa** [Type Instructor]

   ```
       email: difa@gradschoolzero.edu
       password: password
   ```

4. **Behnam Sidsel** [Type Instructor]

   ```
       email: bsidsel@gradschoolzero.edu
       password: password
   ```

5. **Student** [Type Student]

   ```
       email: student@gradschoolzero.edu
       password: password
   ```

6. **Jeffrey Mina** [Type Student]

   ```
       email: jmina@gradschoolzero.edu
       password: password
   ```

7. **Sanjay Nikša** [Type Student]

   ```
       email: sniksa@gradschoolzero.edu
       password: password
   ```

8. **Ioses Mirko** [Type Student]

   ```
       email: imirko@gradschoolzero.edu
       password: password
   ```
