import React, { Component, Fragment } from 'react';
import ErrorBoundary from "./ErrorBoundary";
import SearchDataTable from "./SearchDataTable";
import { ContextProvider, withLocalization } from "./localizationContext";

import { library } from '@fortawesome/fontawesome-svg-core';
import LocalizedStrings from 'react-localization';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

library.add(faFileAlt);
library.add(faFilePdf);

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		strings.setLanguage(this.props.lang);
	}

	render() {
		return (
			<ContextProvider lang={this.props.lang}>
					<Fragment>
						<h2 style={{paddingTop: 15}}>{strings.searchResults}</h2>
						<ErrorBoundary>
							<SearchDataTable />
						</ErrorBoundary>
					</Fragment>
			</ContextProvider>
		)
	}
}

export default Search;

//Content Copy
let strings = new LocalizedStrings({
  en:{
    searchResults:"Search Results",
  },
  fr: {
    searchResults:"Résultats de la recherche",
  },
});