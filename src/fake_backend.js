const apiurl = import.meta.env.VITE_FAKE_BACKEND_APIURL;
const flowid = import.meta.env.VITE_FAKE_BACKEND_FLOWID;
const apikey = import.meta.env.VITE_FAKE_BACKEND_APIKEY

const defaultHeader = {
    'Content-Type': "application/json",
    'x-api-key': apikey,
    'api-version': '1.0'
};

// Call Incode's `omni/start` API to create an Incode session which will include a
// token in the response.
const fakeBackendStart = async function() {
    const url = `${apiurl}/omni/start`;
    const params = {
        configurationId: flowid,
        // language: "en-US",
        // redirectionUrl: "https://example.com?custom_parameter=some+value",
        // externalCustomerId: "the id of the customer in your system",
    };
    
    let response;
    try {
        response = await fetch(url, { method: 'POST', body: JSON.stringify(params), headers: defaultHeader});
        if (!response.ok) {
            throw new Error('Request failed with code ' + response.status)
        }
    } catch(e) {
        throw new Error('HTTP POST Error: ' + e.message)
    }
    
    // The session response has many values, but you should only pass the token to the frontend.
    const {token} = await response.json();
    return {token};
}

// Call Incode's `omni/start` API to create an Incode session and then
// `omni/onboarding-url` to generate the onboardingURL
const fakeBackendUrl = async function(token) {
    const onboardingUrl = `${apiurl}/0/omni/onboarding-url`;

    let sessionHeaders = {...defaultHeader};
    sessionHeaders['X-Incode-Hardware-Id'] = token;
        
    let response;
    try {
        response = await fetch(onboardingUrl, { method: 'GET', headers: sessionHeaders});
        if (!response.ok) {
            throw new Error('Request failed with code ' + response.status)
        }
    } catch(e) {
        throw new Error('HTTP GET Error: ' + e.message)
    }
    
    const {url} = await response.json();
    return {token, url};
}

// Used to poll for the onboarding status
const fakeBackendStatus = async function(token) {
    const url = `${apiurl}/0/omni/get/onboarding/status`; 

    let sessionHeaders = {...defaultHeader};
    sessionHeaders['X-Incode-Hardware-Id'] = token;
    
    let response;
    try {
        response = await fetch(url, {method: 'GET', headers: sessionHeaders});
        if (!response.ok) {
            throw new Error('Request failed with code ' + response.status)
        }
    } catch(e) {
        throw new Error('HTTP GET Error: ' + e.message)
    }
    const {onboardingStatus} = await response.json();
    return {onboardingStatus};
}

// Gets the results of the onboarding
const fakeBackendScore = async function(token) {
    const url = `${apiurl}/0/omni/get/score`; 

    let sessionHeaders = {...defaultHeader};
    sessionHeaders['X-Incode-Hardware-Id'] = token;
    
    let response;
    try {
        response = await fetch(url, {method: 'GET', headers: sessionHeaders});
        if (!response.ok) {
            throw new Error('Request failed with code ' + response.status)
        }
    } catch(e) {
        throw new Error('HTTP GET Error: ' + e.message)
    }
    const results = await response.json();
    const overallStatus = results?.overall?.status
    return {overallStatus}
}

export {fakeBackendStart, fakeBackendUrl, fakeBackendStatus, fakeBackendScore};