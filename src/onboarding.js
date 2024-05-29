const tokenServerURL=import.meta.env.VITE_TOKEN_SERVER_URL;

export async function fetchOnboardingStatus(interviewId) {
  const response = await fetch(`${tokenServerURL}/onboarding-status?interviewId=${interviewId}`, {});
  return await response.json();
}

export async function fetchScore(interviewId, token) {  
  const headers = new Headers({
    'X-Token': token
  });
  const response = await fetch(`${tokenServerURL}/fetch-score?interviewId=${interviewId}`, {headers});
  return await response.json();
}

export async function fetchOnboardingUrl() {
  const response = await fetch(`${tokenServerURL}/onboarding-url`,{});
  return await response.json();
}
