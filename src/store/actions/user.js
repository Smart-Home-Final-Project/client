import * as actionTypes from '../actionTypes'

export const setUser = (user) => {
    console.log(user)
    return {
        type: actionTypes.SET_USER,
        payload: user
    }
}

export const setActioAlerts = (alerts) => {
    console.log(alerts)
    return {
        type: actionTypes.SET_ACTION_ALERTS,
        payload: alerts
    }
}

export const setChannels = (channels) => {
    console.log(channels)
    return {
        type: actionTypes.SET_CHANNELS,
        payload: channels
    }
}

export const setGroups = (groups) => {
    return {
        type: actionTypes.SET_GROUPS,
        payload: groups
    }
}

export const setPlc = (plc) => {
    return {
        type: actionTypes.SET_PLC,
        payload: plc
    }
}