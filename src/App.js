import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import PublicRoom from "./routes/Public_Room";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={PublicRoom} />
        <Route path="/room/:roomID" component={Room} />
        <Route path="/public" exact component={PublicRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
