<p align="center">
  <a href="https://vegh-staging.surge.sh/">
    <img src="https://i.ibb.co/0m4Wrq3/Vegh-Logo-01.png">
  </a>
</p>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/veghfile/frontend/graphs/commit-activity) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://veghfile.github.io/) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://veghfile.github.io/)

# Vegh - A simple & fast file sharing web app
<div style="display:flex;justify-content-center;align-items:center;padding:15px"> 
<div>
  <a href="https://openode.io">
    <img width="50px" src="https://pbs.twimg.com/profile_images/1011301358300028928/j9DKNzoW_400x400.jpg">
  </a>
<a href="https://www.openode.io/" style="display:flex;justify-content-center;align-items:center;padding:15px">Backend sponsored and hosted by opeNode.io</a>
</div>
<div>

<svg width="100" height="64" viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" fill="#000"/></svg><a style="display:flex;justify-content-center;align-items:center;padding:15px" href="https://vercel.com/">Frontend sponsored (pending) and hosted by vercel.com</a>
</div>
</div>

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
