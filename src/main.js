import { fetchOnboardingStatus, fetchScore, fetchOnboardingUrl } from './onboarding';

const createIframe = (url) => {
  const app = document.getElementById('app');
  // Dynamically create the iframe
  const frame = document.createElement('iframe');
  frame.src = url;
  frame.class = 'onboarding-view'
  frame.id = 'app-frame'
  frame.width = '100%';
  frame.height = '100%';
  frame.allowUserMedia = true;
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allow', 'geolocation; microphone; camera;');
  app.appendChild(frame);
}

async function app() {
  const app = document.getElementById('app');
  try {
    const {url, interviewId, token} = await fetchOnboardingUrl();
    app.innerHTML = "";
    
    if (url) {
      createIframe(url);
    }

    const interval = setInterval(async () => {
      const onboarding = await fetchOnboardingStatus(interviewId);
      if (onboarding.success===true && onboarding.onboardingStatus==='ONBOARDING_FINISHED'){
        clearInterval(interval);
        
        // Remove iframe from the parent node
        const frame = document.getElementById('app-frame');
        frame.parentNode.removeChild(frame);
        
        const score = await fetchScore(interviewId, token);
        if (score.success) {
          app.innerHTML =`<h1>Onboarding finished with score: ${score.score}</h1>`;
        } else {
          app.innerHTML =`<h1>There was an error: ${score.error}</h1>`;
        } 
      } else if (onboarding.success===false) {
        clearInterval(interval);
        app.innerHTML =`<h1>There was an error: ${onboarding.error}</h1>`;
      }
    }, 100000);
  } catch(e) {
    app.innerHTML =`<h1>There was an error: ${e.message}</h1>`;
  } 
}

document.addEventListener("DOMContentLoaded", app);
