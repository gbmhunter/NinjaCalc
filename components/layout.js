

import Nav from '~/components/nav'
import Head from 'next/head'

// import 'bootstrap/dist/css/bootstrap.min.css';



export default ({ children, title = 'This is the default title' }) => (
  <div style={{ height: '100%' }}>
    <header>
      <Nav />
    </header>

    <main className='vbox' style={{ height: '100%' }}>
      { children }
    </main>

    {/* GLOBAL STYLES */}
    <style jsx global>{`
        .hbox {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        .vbox {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        p, h1, h2, h3, ul, li, a, div, td, th, input {    
          font-family: 'avenir next' ,'avenir', sans-serif;
        }
        .green-background {
          background-color: #ccffcc;
        }
    `}</style>
  </div>
)