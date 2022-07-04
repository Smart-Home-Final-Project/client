export const fetchActionAlert = async (user) => {
    let res;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    await fetch(`http://localhost:4500/actionAlert/${user._id}`, requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    console.log(res)
    return res;
}

export const fetchUserByToken = async (user) => {
    let res;
    let headers = new Headers();
    headers.append("authorization",`Bearer ${localStorage.getItem("token")}`)
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers
    };
    await fetch(`http://localhost:4500/user/token`, requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    return res;
}

export const fetchPlc = async (user) => {
    let plc;
    let headers = new Headers();
    headers.append("authorization",`Bearer ${localStorage.getItem("token")}`)
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers
    };

    await fetch(`http://localhost:4500/plc/user/${user._id}`, requestOptions)
        .then(response => response.json())
        .then(result => plc = result)
        .catch(error => console.log('error', error));
    return plc;
}

export const fetchChannels = async (plc) => {
    let channels;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    await fetch(`http://localhost:4500/channel/all?id=${plc._id}`, requestOptions)
        .then(response => response.json())
        .then(result => channels = result)
        .catch(error => console.log('error', error));
    return channels;
}

export const fetchGroups = async (user) => {
    let res;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    await fetch(`http://localhost:4500/ChannelGroup/${user._id}`, requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    console.log(res)
    return res;
}
