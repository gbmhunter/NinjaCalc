// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { GA_TRACKING_ID } from '../lib/gtag'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          {/* Providing "async" to the MathJax script loading can cause problems with the global object MathJax not being available in time for when specific pages want
        to render their equations. */}
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
            dangerouslySetInnerHTML={{
              __html: String.raw`
            MathJax.Hub.Config({
                extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],
                TeX: {
                  Macros: {
                    // Define macros here that can be used site-wise
                    bhat: ["{\\hat{\\mathbf{#1}}}", 1],
                    b: ["{\\mathbf{#1}}", 1],
                  }
                },
                tex2jax: {
                  inlineMath: [['\\(','\\)']],
                  displayMath: [['$$','$$'], ['\\[','\\]']],
                  processEscapes: true,
                  processEnvironments: true,
                  skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                  TeX: {
                    extensions: [
                      "AMSmath.js",
                      "AMSsymbols.js"
                    ],
                  },
                },
                // Enable line-breaks, which makes MathJAX wrap long display equations
                // This only occurs on the initial render, so if the page width is changed by user,
                // the equation may still overflow the page.
                CommonHTML: { linebreaks: { automatic: true } },
                "HTML-CSS": { linebreaks: { automatic: true } },
                SVG: { linebreaks: { automatic: true } }
              });
                `,
            }}
          ></script>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />

          {/* Global Site Tag (gtag.js) - Google Analytics
          See https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics for where
          this code came from */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />


        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
