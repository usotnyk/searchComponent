import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import { withLocalization } from "./localizationContext";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    
    strings.setLanguage(this.props.lang);
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <h4>{strings.errorMsg}</h4>;
    }
    return this.props.children;
  }
}

export default withLocalization(ErrorBoundary);

//Content Copy
let strings = new LocalizedStrings({
  en:{
    errorMsg: "Something went wrong, please try again later. If you are using an older browser, you might need to upgrade it.",
  },
  fr: {
    errorMsg: "Quelque chose s'est mal passé, réessayez plus tard.",
  },
});