// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

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
        <script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
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
                `
          }}></script>
          <link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
  crossorigin="anonymous"
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