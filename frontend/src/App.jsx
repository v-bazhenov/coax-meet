import React from "react";

import "fontsource-roboto";
import Routes from "./Routes";
import Container from "@material-ui/core/Container";
import Footer from "./components/Footer.jsx";

class App extends React.Component {
  render() {
    return (
      <Container>
        <Routes />
        <Footer />
      </Container>
    );
  }
}

export default App;
