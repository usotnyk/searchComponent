import React, { Component, Fragment } from 'react';
import _ from "lodash";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocalizedStrings from 'react-localization';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import FiltersGroup from './FiltersGroup';
import { getMuiTableTheme } from './Themes';
import SearchForm from './SearchForm';
import { withLocalization } from "./localizationContext";

const filters = {
  type: {
    "code": ["htm", "com/"],
    "pdf": ["pdf"],
    "all": ["htm", "com/", "pdf"],
  }
}

const excludedUrls = [
  '/introduction.htm',
  '/truthfulness.htm',
  '/consistency.htm',
  '/transparency-a.htm',
  '/transparency-b.htm',
  '/transparency-c.htm',
  '/transparency-d.htm',
  '/transparency-e.htm',
  '/transparency-f.htm',
  '/relevancy-a.htm',
  '/relevancy-b.htm',
]

const columnsToShow = [
  'details',
];

class SearchDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: null,
      isLoading: true,
      isError: false,
      searchParam: null,
      noResults: false,
      tableFilters: 'code',
    }

    strings.setLanguage(this.props.lang);

    this.sendAjaxCall = this.sendAjaxCall.bind(this);
  }

  componentDidMount() {
    const searchParam = this.getQueryString();
    this.getSearchData(searchParam);
  }

  getQueryString() {
    const queryString= window.location.search;
    if(!queryString) {
      return null;
    }
    const searchParam = queryString.substring(
      queryString.indexOf("=") + 1, 
      queryString.lastIndexOf("&")
    );

    if(searchParam) {
      this.setState({ searchParam })
    }
    return searchParam;
  }

  getSearchData(param) {
    this.sendAjaxCall(param, this.props.lang)
      .then((response) => {
        // throw new Error();

      response.data.result.length
        ? this.setState({ 
            isLoading: false, 
            searchResults: this.getFilteredSearchResults(response.data.result)
          })
        : this.setState({ 
            isLoading: false, 
            noResults: true 
          })
      })
      .catch((error) => {
        console.log(error);
        this.setState({ 
          isLoading: false,
          isError: true,
        })
      })
  }

  getFilteredSearchResults(results) {
    const filteredResults = results.filter(row =>
      _.every(
        excludedUrls,
        url => !_.includes(row.url, url)
      )
    );
    return filteredResults;
  }

  sendAjaxCall(query, lang) {
    let elementString = "search_result._stk?out=json&search="
    if(lang === "fr") {
      elementString = "fr_" + elementString;
    }
    return axios.get(`/${elementString}${query}&searchlimit=100`)
  }

  renderNewSearch() {
    return (
      <Fragment>
        <div>{strings.enterSearch}</div>
        <SearchForm/>
      </Fragment>
    )
  }

  renderLoading() {
    return (<div>{strings.loading}</div>);
  }

  renderError() {
    return (<div>{strings.errorMsg}</div>);
  }

  renderEmptyResult() {
    const { searchParam } = this.state;

    return(
      <Fragment>
        <SearchForm value={searchParam}/>
        <div>{strings.noResults1}<strong>'{ decodeURI(searchParam) }'</strong> {strings.noResults2}</div>
        <div style={{marginBottom: 20, marginTop: 20}}>{strings.suggestions1}</div>
        <ul>
          <li>{strings.suggestions2}</li>
          <li>{strings.suggestions3}</li>
          <li>{strings.suggestions4}</li>
        </ul>
      </Fragment>
    )
  }

  renderSearchSummary() {
    const { searchParam, searchResults: { length: searchResultsLength } } = this.state;

    return(
      <div className="searchSummary" style={{marginTop: 20, marginBottom: 20}}>{strings.searchSummary1} <strong>'{ decodeURI(searchParam) }'</strong>{strings.searchSummary2}{`${searchResultsLength}`} {strings.searchSummary3}.
      </div>
    )
  }

  getTableRows(data) {
    const { tableFilters } = this.state;
    const currentFilterMapped = filters.type[tableFilters];
    const filteredData = data.filter(row => _.includes(currentFilterMapped, row.ext));

    let tableRows = [];
    filteredData.forEach(row => {
      tableRows.push(Object.values(row));
    });
    return tableRows;
  }

  //Converting html string into innerHTML to render spans with search keywords
  createMarkup(htmlString) {
    let htmlStringTruncated = htmlString;
    if(window.innerWidth < 650) {
      htmlStringTruncated = htmlString.substring(0, 100)+`...`;
    }
    return {__html: htmlStringTruncated}
  }

  renderIcon(ext) {
    return ext === 'pdf'
      ? (
        <Tooltip title="PDF">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon="file-pdf" style={{height: '1.5em', width: '1.5em'}}/>
          </div>
        </Tooltip>
      )
      : (
        <Tooltip title="Code">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon="file-alt" style={{height: '1.5em', width: '1.5em'}}/>
          </div>
        </Tooltip>
      )
  }

  getTableColumns(data) {
    const { searchParam } = this.state;
    const tableColumns = Object.keys(data[0]);
    const customTableColumns = tableColumns.map((col, i) => {
      if(col === 'details') {
        return {
          name: '',
          options: {
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <Fragment>
                  <a href={`${window.location.origin}${value.url}?searchMark=${searchParam}`}>
                    <div className="search-detail-card">
                      { this.renderIcon(value.ext) }
                      <div className="search-detail-group">
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          {/* <h4 className="search-title">{value.title}</h4> */}
                          <h4 className="search-title" dangerouslySetInnerHTML={this.createMarkup(value.title)}/>
                          <div className="search-score">{`Score : ${value.score}`}</div>
                        </div>
                        <div className='search-context' dangerouslySetInnerHTML={this.createMarkup(value.context)}/>
                      </div>
                    </div>
                  </a>
                </Fragment>
              )
            }
          },
        }
      }
      return {
        name: col,
        options: {
          display: columnsToShow.includes(col),
        },
      }
    })
    return customTableColumns;
  }

  onFiltersChange(filterName, filterValue) {
    this.setState({tableFilters : filterValue})
  }

  renderDataTable() {
    const { searchResults, searchParam } = this.state;
    
    const tableData = searchResults.map((row, i) => ({
      rank: row.num,
      ext: row.ext,
      details: {
        context: row.context,
        title: row.title,
        ext: row.ext,
        url: row.url,
        score: row.score2,
        num: i+1,
      },
    }));

    const options = {
      filterType: 'checkbox',
      selectableRows: false,
      viewColumns: false,
      search: false,
      responsive: 'scroll',
      download: false,
      print: false,
      filter: false,
      page: 0,
    };

    return (
      <Fragment>
        { 
          this.renderSearchSummary()
        }
        <Paper 
          style={{
            marginBottom: 15,
            padding: 15, 
            display: 'flex', 
            flexWrap: 'wrap'
          }}
          >
          <SearchForm value={searchParam}/>
          <FiltersGroup onChange={ (filterName, value) => this.onFiltersChange(filterName, value) }/>
        </Paper>
        <MuiThemeProvider theme={getMuiTableTheme()}>
          <MUIDataTable
            data={this.getTableRows(tableData)}
            columns={this.getTableColumns(tableData)}
            options={options}
          />
        </MuiThemeProvider>
      </Fragment>
    )
  }

  render() {
    const { searchParam, isLoading, isError, noResults } = this.state;
    if (searchParam === null) {
      return this.renderNewSearch();
    } else {
      if (isLoading) {
        return this.renderLoading();
      }
      if (isError) {
        return this.renderError();
      }
      if (noResults) {
        return this.renderEmptyResult();
      }
      return this.renderDataTable();
    }
  }
}

export default withLocalization(SearchDataTable);

//Content Copy
let strings = new LocalizedStrings({
  en:{
    errorMsg:"Something went wrong, please try again later.",
    loading: "Loading...",
    searchSummary1: "Your search for ",
    searchSummary2: " yielded ",
    searchSummary3: "results",
    enterSearch: "Please enter search criteria:",
    noResults1: "Sorry, your search for ",
    noResults2: "did not match any documents.",
    suggestions1: "Suggestions:",
    suggestions2: "Make sure all words are spelled correctly.",
    suggestions3: "Try different search term.",
    suggestions4: "Try a more general search term.",
  },
  fr: {
    errorMsg:"Quelque chose s'est mal passé, réessayez plus tard.",
    loading: "Chargement...",
    searchSummary1: "Votre recherche pour ",
    searchSummary2:" a abouti à ",
    searchSummary3:"résultats",
    enterSearch: "S'il vous plaît entrer des critères de recherche.",
    noResults1: "Désolé, votre recherche de ",
    noResults2: "ne correspond à aucun document.",
    suggestions1: "Suggestions:",
    suggestions2: "Assurez-vous que tous les mots sont orthographiés correctement.",
    suggestions3: "Essayez terme de recherche différents.",
    suggestions4: "Essayez un terme plus général de recherche.",
  },
});