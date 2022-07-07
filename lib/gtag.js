
// Old UA ID
// export const GA_TRACKING_ID = 'UA-92834105-1'
// New GA4 ID
export const GA_MEASUREMENT_ID = 'G-GSDKH4JPL0'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}