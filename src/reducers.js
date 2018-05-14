// @flow

import {
  SET_YEAR
} from './actionTypes'

type State = {
  yearFrom: number | null
}

type Action < T > = {
  type: string,
  payload: T
}

const initialState = {
  yearFrom: 2013
}

export default function (state: State = initialState, action: Action < any > ) {
  switch (action.type) {
    case SET_YEAR:
      return {
        ...state,
        yearFrom: action.payload.yearFrom
      }

    default:
      return state
  }
}