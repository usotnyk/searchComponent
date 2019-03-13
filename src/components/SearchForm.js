import React, { Component, Fragment } from 'react';
import LocalizedStrings from 'react-localization';
import { withLocalization } from "./localizationContext";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value && decodeURI(this.props.value),
    };
    strings.setLanguage(this.props.lang);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const { value } = this.state;

    event.preventDefault();
    if(value) {
      console.log(value);
      window.location.href = `search.htm?search=${value}&act=Search`
    }
  }

  render() {
    return (
      <div className="search-form-wrapper">
        <form onSubmit={this.handleSubmit}>
            <input className="searchText" type="text" name="search" value={this.state.value} onChange={this.handleChange} />
          <input className="searchButton" type="submit" value={strings.search} />
        </form>
      </div>
    );
  }
}

export default withLocalization(SearchForm);

//Content Copy
let strings = new LocalizedStrings({
  en:{
    search:"Search",
  },
  fr: {
    search:"Recherche",
  },
})