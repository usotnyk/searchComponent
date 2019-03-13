import { createMuiTheme } from '@material-ui/core/styles';

export function getMuiTableTheme() {
    return createMuiTheme({
      overrides: {
        MuiTableRow: {
          root: {
            cursor: 'pointer',
          },
        },
        MuiTablePagination: {
          select: {
            paddingRight: 20,
          },
          toolbar: {
            paddingLeft: 2,
          },
        },
        MUIDataTableToolbar: {
          root: {
            // display: 'none',
            minHeight: 30,
          },
        },
        MUIDataTableHeadRow: {
          root: {
            display: 'none',
          },
        },
        MUIDataTableHeadCell: {
          data: {
            textTransform: 'uppercase',
            fontWeight: 400,
            fontSize: 20,
          },
          toolButton: {
            height: 'auto',
            display: 'flex',
            flexWrap: 'nowrap',
          },
        },
        MuiTableCell: {
          root: {
            padding: '4px 24px 4px 24px',
          },
        },
      }
    })
  }