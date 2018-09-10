import SemVer from "semver"

import assert from "assert"

const canTestAsyncIterators = SemVer.satisfies(process.version, ">=10")
const canTestAsyncFunctions = SemVer.satisfies(process.version, ">=7.6.0")

describe("top-level await tests", () => {
  before(function () {
    if (! canTestAsyncFunctions) {
      this.skip()
    }
  })

  it("should support `options.await`", () => {
    const requests = [
      "./fixture/top-level-await/empty-cjs.js",
      "./fixture/top-level-await/empty-esm.js",
      "./fixture/top-level-await/export-cjs.js",
      "./fixture/top-level-await/nested.js"
    ]

    if (canTestAsyncIterators) {
      requests.push("./fixture/top-level-await/iterator.js")
    }

    return Promise
      .all(requests.map((request) => import(request)))
  })

  it("should not support `options.await` for ES modules with exports", () =>
    Promise
      .all([
        "./fixture/top-level-await/export-esm.js",
        "./fixture/top-level-await/re-export.js"
      ]
      .map((request) =>
        import(request)
          .then(() => assert.fail())
          .catch((e) => assert.strictEqual(e.name, "SyntaxError"))
      ))
  )
})
