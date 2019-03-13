import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LocalizedStrings from 'react-localization';
import { withLocalization } from "./localizationContext";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class FiltersGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'code',
      labelWidth: 0,
    };

    strings.setLanguage(this.props.lang);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
    this.props.onChange(name, value);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="search-filters-group-wrapper">
        <h4 style={ {color: 'DimGrey', marginRight: 15, alignSelf: 'center'} }>{strings.filterBy}</h4>
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <Select
              value={this.state.type}
              onChange={this.handleChange}
              inputProps={{
                name: 'type',
                id: 'type-simple',
              }}
            >
              <MenuItem value={'code'}>Code</MenuItem>
              <MenuItem value={'pdf'}>PDFs</MenuItem>
              <MenuItem value={'all'}>{strings.all}</MenuItem>
            </Select>
          </FormControl>
        </form>
      </div>
    );
  }
}

FiltersGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(FiltersGroup);
export default withStyles(styles)(withLocalization(FiltersGroup));

//Content Copy
let strings = new LocalizedStrings({
  en:{
    filterBy: "Filter by:",
    all: "All",
  },
  fr: {
    filterBy: "Filtrer par:",
    all: "Tout",
  },
})