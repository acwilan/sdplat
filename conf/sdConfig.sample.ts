export const config = {
    beam: {
        models: {
            "model1": {
                name: "Model 1",
                targets: ['txt2img']
            },
            "model2": {
                name: "Model 2",
                targets: ['txt2img']
            },
            "model3": {
                name: "Model 3",
                targets: ['txt2img']
            }
        },
        authToken: 'beamAuthToken'
    },
    modelsLab: {
        apiKey: 'modelsLabAuthToken'
    }
};
