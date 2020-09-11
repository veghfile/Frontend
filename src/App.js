import React from 'react';
import {MainPublicProvider} from './context/Maincontext';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Room from "./routes/Room";
import PublicRoom from "./routes/Public_Room";
import {AnimatePresence} from "framer-motion";

function App() {
  return (
    <BrowserRouter>
      <MainPublicProvider>
    <AnimatePresence exitBeforeEnter>
      <Switch>
        <Route path="/" exact component={PublicRoom} />
        <Route path="/room/:roomID" component={Room} />
        <Route path="/public" exact component={PublicRoom} />
      </Switch>
    </AnimatePresence>
    </MainPublicProvider>
    </BrowserRouter>
  );
}

export default App;
