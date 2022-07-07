# NinjaCalc

![Build Status](https://github.com/gbmhunter/NinjaCalc/workflows/Node.js%20CI/badge.svg)

## Dev Usage

To install dependencies and start development server (`yarn` is recommended):

```bash
yarn install
yarn dev
```

By default, the local server will start at `localhost:3000`.

To run unit/functional tests:

```bash
yarn test
```

## CICD

Unit/functional tests are run by GitHub actions. These are configured by the file `.github/workflows/node.js.yaml`.

## Deployment

Deployment is done automatically when changes are pushed to the `master` branch. Deployment is done by Vercel, info can be found at https://vercel.com/gbmhunter/ninja-calc.
