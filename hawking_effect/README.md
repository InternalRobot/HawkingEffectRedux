# The Hawking Effect
This repository contains the codebase for The Hawking Effect.

## Getting Started

Install latest Nodejs and NPM

from repo root directory, run `npm install`

from repo root directory, run `bower install`

To run local server, run `grunt serve`

To build minified for production, run `grunt build`

### Getting Data
You can get started by copying the sample file:
````
cp app/data.json.sample app/data.json
````
But the grunt build process will assemble `data.json` for you:
````
export GOOGLE_CLIENT_ID=[your_value_here]
export GOOGLE_CLIENT_SECRET=[your_value_here]
export GOOGLE_REDIRECT_URL=[your_value_here]
export GOOGLE_ACCESS_TOKEN=[your_value_here]
export GOOGLE_DOCUMENT_KEY=[your_value_here]
export GOOGLE_REFRESH_TOKEN=[your_value_here]
export GOOGLE_ACCESS_TOKEN_EXPIRES=[your_value_here]

grunt import_graph_data
````
See your friendly Lead Developer for appropriate values.

## Libraries

D3 - https://github.com/mbostock/d3/wiki

Backbone - http://backbonejs.org/

Lodash - https://lodash.com/
