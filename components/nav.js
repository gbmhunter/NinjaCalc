import React from 'react'

import Head from 'next/head'
import Link from 'next/link'

import KofiButton from "kofi-button"

import pkg from 'package.json'

const Nav = () => (
  <nav>
    <ul id='left-header'>
      <li>
        <Link href='/'>
          <a className='site-title'>NinjaCalc</a>
        </Link>
      </li>
    </ul>

    <div id='right-header'>
      <div id='version-number'>v{pkg.version}</div>
      {/* <!-- Support Me on Ko-fi button --> */}
      {/* <!-- Code from https://ko-fi.com/manage/widgets?src=sidemenu --> */}
      {/* <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script> */}
      <div id="kofi-button-wrapper">
      <KofiButton color="#29abe0" title="Donate" kofiID="M4M8CBE56" />
      </div>
    </div>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
        background-color: var(--primary-color);
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px; // Space between header bar and left/right columns
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        margin: 0px;
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #ffffff;
        text-decoration: none;
        font-size: 1.2em;
        display: flex;
        align-items: center;
      }

      #right-header {
        display: flex;
        align-items: center;
      }

      #kofi-button-wrapper {
        margin: 10px 10px;
      }

      #version-number {
        color: #ffffff;
      }
    `}</style>
  </nav>
)

export default Nav
