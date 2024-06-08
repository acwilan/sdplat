# SDPlat UI

This is a web interface for SD platform, written as a react application, that acts as the frontend for the platform.

## Local environment set up

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## Configuration file

You need to create a configuration file at the pat `./conf/sdConf.ts`. A [sample file](../conf/sdConfig.sample.ts) is provided so that you get an idea of the structure. This file is expected to be shared between the web ui and the bot.

### Models

You need to define your stable diffusion models in the `models` array. The models are defined as objects with the following properties:

- `id` (required): The id of the model. This is used to identify the model in the UI.
- `name` (required): The name of the model. This is used to display the model in the UI.
- `beamId` (optional): The ID of the application deployed in beam.cloud that holds the model. Please refer to [the beam documentation on setting up Stable Diffusion API](https://docs.beam.cloud/examples/stable-diffusion-gpu).

### Beam

- `authToken` (optional): The auth token for beam.cloud. This is required if you want to use the beam API.

### Commands

- `yarn install` - install dependencies
- `yarn start` - start the development server
- `yarn build` - build the production version
- `yarn test` - run tests
- `yarn test --coverage` - run tests with coverage
