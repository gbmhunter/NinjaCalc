/**
 * Layout component specifically for calculator pages.
 */

import React from 'react'
import Nav from '~/components/nav'
import Head from 'next/head'

// import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './layout'


export default ({ children, title = 'This is the default title' }) => (
  <Layout>
      <h1>{title}</h1>
      { children }
  </Layout>
)