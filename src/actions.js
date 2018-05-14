// @flow

import {
  SET_YEAR
} from './actionTypes'

export function setYear(yearFrom: number | null) {
  return {
    type: SET_YEAR,
    payload: {
      yearFrom
    }
  }
}