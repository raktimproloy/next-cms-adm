const localAPI = import.meta.env.VITE_LOCAL_API
const deploymentAPI = import.meta.env.VITE_DEPLOYMENT_API
const currentURL = window.location.origin

// export const API_HOST = currentURL.includes("https://min.nextctl.co.uk") ? deploymentAPI : localAPI
export const API_HOST = currentURL.includes("https://") ? deploymentAPI : localAPI

