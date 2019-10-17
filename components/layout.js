

import Nav from '~/components/nav'

export default ({ children, title = 'This is the default title' }) => (
  <div>
    <header>
      <Nav />
    </header>

    <main>
      { children }
    </main>

    {/* GLOBAL STYLES */}
    <style jsx global>{`
        .hbox {
          display: flex;
          flex-direction: row;
          jusity-content: center;
          align-items: center;
        }
        .vbox {
          display: flex;
          flex-direction: column;
          jusity-content: center;
          align-items: center;
        }
    `}</style>
  </div>
)