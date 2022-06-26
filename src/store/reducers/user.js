import * as actionTypes from '../actionTypes'

const initialState = {
    user: null,
    actionAlert: null,
    groups: null,
    plc: null,
    channels: null
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case actionTypes.SET_ACTION_ALERTS:
            return {
                ...state,
                actionAlert: action.payload
            }
        case actionTypes.SET_GROUPS:
            return {
                ...state,
                groups: action.payload
            }
        case actionTypes.SET_PLC:
            return {
                ...state,
                plc: action.payload
            }
        case actionTypes.SET_CHANNELS:
            return {
                ...state,
                channels: action.payload
            }

        default:
            return state
    }
}