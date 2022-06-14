const matchesList = async (authUser) => {
    let auth = '';
    if (authUser) {
        auth = window.btoa(JSON.stringify(authUser));
    }

    return fetch(process.env.REACT_APP_API_URL + '/list-matches', {
        headers: { 'Authorization': 'Bearer ' + auth }
    }).then(r => r.json());
};

const castVote = async (authUser, matchId, type) => {
    let auth = '';
    if (authUser) {
        auth = window.btoa(JSON.stringify(authUser));
    }

    return fetch(process.env.REACT_APP_API_URL + '/cast-vote', {
        method: 'post',
        headers: { 'Authorization': 'Bearer ' + auth },
        body: JSON.stringify({ matchId, type })
    }).then(r => r.json());
};

export { matchesList, castVote }
