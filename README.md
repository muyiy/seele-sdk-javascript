## Install
```bash
npm i seele-sdk-javascript
```

## Test

```bash
npm test
# for individual test
# npm test test/key.test
# npm test test/keystore.test
```

## Dev

1. code changes
0. test
0. document changes
0. generate document 
0. update npm version
0. git commit
0. npm publish

## Doc

Full API reference and more tutorials are linked [here]("").

## Doc generation

There are two html documentation styles:

1. [sphinx]("http://sphinx-doc.org/") with [Read the Docs]("https://github.com/readthedocs/sphinx_rtd_theme") theme.

  - Install sphinx packages.
  ```bash
  brew install sphinx
  sphinx-build --version
  conda install -c anaconda sphinx_rtd_theme
  conda install -c anaconda sphinx
  ```
  - Generate.
  ```bash
  npm run docs
  ```

2. [jsdoc](https://devdocs.io/jsdoc/) with [minami]("https://github.com/nijikokun/minami") theme.

  - Generate.
  ```bash
  npm run docj
  ```

3. more related to mac
  ```bash
  brew install pyenv

  ```
