# NinjaCalc

![Build Status](https://github.com/gbmhunter/NinjaCalc/workflows/Node.js%20CI/badge.svg)

> **⚠️ Deprecated.** NinjaCalc is no longer actively developed. All calculators have been ported to [blog.mbedded.ninja/calculators](https://blog.mbedded.ninja/calculators/), where they are now maintained. Visiting the NinjaCalc homepage redirects to the blog's calculator index, and individual calculator URLs redirect to their new locations (see `vercel.json`). This repository is kept around for historical reference.

## Dev Usage

To install dependencies and start development server:

```bash
npm install
npm run dev
```

By default, the local server will start at `localhost:3000`.

To run all unit/functional tests:

```bash
npm test
```

To run unit/functional tests which match a particular pattern:

```bash
npm test -- <pattern>
```

e.g. to run all tests in `utils/standard-resistance-finder.test.js`:

```bash
npm test -- standard-resistance-finder
```

## Tests

Unit tests that don't need to mount react components are saved in `.test.js` files next to the source code. Tests which need to mount a react component (e.g. functional tests for each calculator) are in `__tests__/`.

## CICD

Unit/functional tests are run by GitHub actions. These are configured by the file `.github/workflows/node.js.yaml`.

## Releasing

Update the `CHANGELOG.md` with the changes since the last release. Make sure to update the version in `package.json`, this is pulled in by the client-side javascript and displayed in the app.

Deployment is done automatically when changes are pushed to the `master` branch. Make sure to `git tag` with the correct version number. Deployment is done by Vercel, info can be found at https://vercel.com/gbmhunter/ninja-calc.
