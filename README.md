<p align="center">
  <a href="https://vegh-staging.surge.sh/">
    <img src="https://i.ibb.co/0m4Wrq3/Vegh-Logo-01.png">
  </a>
</p>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/veghfile/frontend/graphs/commit-activity) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://veghfile.github.io/) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://veghfile.github.io/)

# Vegh - A simple & fast file sharing web app
<p align="center">
  <a href="https://openode.io">
    <img width="50px" src="https://pbs.twimg.com/profile_images/1011301358300028928/j9DKNzoW_400x400.jpg">
  </a>
<a href="https://www.openode.io/" style="display:flex;justify-content-center;align-items:center;padding:15px">Front-end sponsored and hosted by opeNode.io</a>
</p>

Vegh is a file sharing progressive web app(PWA) that allows users to send files between multiple devices.
It works similar to the SHAREit or Google Files app but uses web technology to complete the installation process
traditional apps for different devices and applications. It also supports current file sharing on multiple devices at the same time as many file sharing applications are lacking.

Vegh uses WebSockets and WebRTC to transfer files between multiple devices.
It currently uses `socket.io` to make real-time connections on `express` backend. The frontend is built on [React](https://reactjs.org).
The current method of sharing files involves sharing file as chunks of ArrayBuffer. This may change to increase the efficiency of the file transfer.  

## Table of Contents
- [Project structure](#project-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
    - [`static` folder](#static-folder)
    - [`public` folder](#public-folder)
  - [Build process](#build-process)
- [Contributing](#contributing)
- [Running Vegh in production](#running-Vegh-in-production)
  - [Building the frontend](#building-the-frontend)
  - [Building the backend](#building-the-backend)
  - [Starting the server](#starting-the-server)
- [License](#license)


## Project structure
The project is divided into the backend and the frontend.

### Backend
Backend code is present on this repo [Backend](https://github.com/vegh-fileshare/Backend) the server.js file contains all the socket connection code. It is built on `express` and `socket.io` which allows usage of WebSockets and WebRTC.There are different routes for admin panel and database connections.

### Frontend
The frontend code is  present on this repo [Frontend](https://github.com/vegh-fileshare/Frontend). Once the frontend is built for production (using npm run build), all the built files are stored in `build` folder which can be deployed along with the server code.

#### `static` folder
This folder is used to store the static files such as images, fonts, and JavaScript files that shouldn't be bundled with the rest of the code.

- React is used for the UI of the app.
- No UI library is being used as of now.
- Sass is used for CSS pre-processing.
### Build process
Build process is setup using NPM run build. It builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Contributing
Thanks for contributing to Vegh! Make sure to **Fork** this repository into your account before making any commits. Then use the following commands to set up the project
### Frontend
```bash
git clone https://github.com/vegh-fileshare/Frontend.git
npm install
```

### Backend
```bash
git clone https://github.com/vegh-fileshare/Backend.git
npm install
```

All development happens on the `staging` branch. The `master` branch contains the known stable version of Vegh. To make your contributions, create a new branch from `staging`.
```bash
git checkout -b my-branch staging
```

Start the live development server. The server would run at port `3000` for frontend and the app can be accessed on `localhost:3000`
```bash
npm run start
```

Start the live development server. The server would run at port `8000` for backend .
```bash
npm run start
```
Now you make sure you make changes needed in the `.env` files

Now you can make your changes, and commit them. Make sure you have a clear and summarized message for your commits
```bash
git add .
git commit -m "My fixes"
```


Push the changes to your fork.
```bash
git push origin my-branch
```

This is a good time, to open a pull request in this repository with the changes you have made. Make sure you open a pull request to merge to `staging` branch and not the `master` branch directly.
## Running Vegh in production

### Building the frontend
```bash
npm run build
```
The frontend built code would be located in the `build` folder.
### Starting the frontend server
```bash
npm start
```
Vegh should be running on port `3000`.
### Building and Starting the backend
```bash
node server.js
```


## License
Vegh is [MIT Licensed](https://github.com/veghfile/veghfile.github.io/blob/master/LICENSE)