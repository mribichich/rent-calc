import {
  connect
} from 'react-redux'

import App from './App'
import {
  setYear
} from './actions'

const mapStateToProps = (state, ownProps) => {
  return {
    yearFrom: state.yearFrom
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setYearFrom: year => {
      dispatch(setYear(year))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)