# Sample Iframe App
This app showcase how to create a low code app that will fetch the
url of the onboarding, load it in an iframe and wait for it to finish
before fetching the score.

```mermaid
sequenceDiagram
    participant i as Incode<br>Hosted<br>Workflow
    participant m as Customer<br>Site
    participant b as Backend

    activate m
    m-->>b: Get Onboarding URL
    note over b: runs /omni/start,<br>/omni/onboarding-url
    b-->>m: {url, token}
    note over m: Create Iframe with URL
    m->>i: Onboarding starts in backend
    
    par
        activate i
        note over i: Do Onboarding
        note over i: Finish onboarding
        deactivate i
    and
        loop
            m-->>b: {token}
            note over b: Fetch Onboarding Status
            b-->>m: {onboardingStatus}
            note over m: If ONBOARDING_FINISHED then<br>continue
        end
    end
    
    note over m: Destroy Iframe
    m-->>b: Fetch Score<br>{token}
    note over b: Fetch Score
    
    b-->>m: {overallStatus}
    note over m: Done
    deactivate m
```

# Fake Backend Server
Starting the session, getting the status and fetching the scores must be
done in the backend, to simplify development this sample includes a
fake_backend.js file that does this in the frontend.

Please be advised to replace this with a proper backend for your
production runs.

The APIKEY should never be exposed in the frontend.

# Install
First install all the required packages
```
npm install
```

# Configure
Copy `.env.example` as `.env` and configure it with the values of your flow

```
# HERE ONLY FOR DEMO PURPOSES, THE APIKEY AND THE FLOW_ID SHOULD NEVER BE IN THE FRONTEND.
VITE_FAKE_BACKEND_APIURL=https://demo-api.incodesmile.com
VITE_FAKE_BACKEND_APIKEY=
VITE_FAKE_BACKEND_FLOWID=
```

# Development
This repo is configured so run it in development by executing
```
npm run dev
```

You will get a hot reloading environment that exposes the page in
localhost and in the ip of the machine in case you want to try it
in your cellphone.

# Author

© Incode Technologies Inc. All rights reserved.