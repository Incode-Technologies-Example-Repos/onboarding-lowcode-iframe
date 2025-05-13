import {
  fakeBackendStartOnboarding,
  fakeBackendStatus,
  fakeBackendScore,
} from "./fake_backend";

const createIframe = (url) => {
  const app = document.getElementById("app");
  app.innerHTML = "";
  // Dynamically create the iframe
  const frame = document.createElement("iframe");
  frame.src = url;
  frame.class = "onboarding-view";
  frame.id = "app-frame";
  frame.width = "100%";
  frame.height = "100%";
  frame.allowUserMedia = true;
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("allow", "geolocation; microphone; camera;");
  app.appendChild(frame);
};

async function app() {
  const app = document.getElementById("app");
  try {
    const { url, interviewId } = await fakeBackendStartOnboarding();

    createIframe(url);

    const interval = setInterval(async () => {
      try {
        const { onboardingStatus } = await fakeBackendStatus(interviewId);
        if (onboardingStatus === "ONBOARDING_FINISHED") {
          clearInterval(interval);

          // Remove iframe from the parent node
          const frame = document.getElementById("app-frame");
          frame.parentNode.removeChild(frame);
          const { overallStatus } = await fakeBackendScore(interviewId);
          app.innerHTML = `<h1>Onboarding finished with overall status: ${overallStatus}</h1>`;
        }
      } catch (e) {
        clearInterval(interval);
        app.innerHTML = `<h1>There was an error: ${e.message}</h1>`;
      }
    }, 2000);
  } catch (e) {
    app.innerHTML = `<h1>There was an error: ${e.message}</h1>`;
  }
}

document.addEventListener("DOMContentLoaded", app);
