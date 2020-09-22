import React from 'react'
import Link from 'next/link'

import { Colors } from '~/utils/colors'

const Nav = () => (
  <nav className="green-background">
    <ul>
      <li>
        <Link href='/'>
          <a>NinjaCalc</a>
        </Link>
      </li>
      
    </ul>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;

      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 1.2em;
      }
    `}</style>
  </nav>
)

export default Nav
