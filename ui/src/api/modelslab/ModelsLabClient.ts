import TextPromptRequest from "../TextPromptRequest";

const baseUrl: string = "https://modelslab.com/api";

export interface TextPromptResponse {
    status: string;
    output: string[];
    message: string;
}

export default class ModelsLabClient {
    private apiKey: string;
    private pollInterval: number;

    constructor(params: { apiKey: string, pollInterval?: number }) {
        this.apiKey = params.apiKey;
        this.pollInterval = params.pollInterval || 3000;
    }

    public async textPrompt(params: { [key: string ]: any}): Promise<TextPromptResponse> {
        const url = `${baseUrl}/v3/text2img`;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(`Invalid response ${response.status}`);
            }
            return response.json();
        })
    }

    public async pollImageStatus(imgUrl: string): Promise<string> {
        const maxRetries = 5;
        let retries = 0;
        return new Promise<string>((resolve, reject) => {
            const poll = setInterval(() => {
                if (retries > maxRetries) {
                    clearInterval(poll);
                    reject(new Error(`Max retries exceeded for image ${imgUrl}`));
                }
                fetch(imgUrl, {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                    }
                })
                .then(response => {
                    if (response.status == 200) {
                        clearInterval(poll);
                        resolve(imgUrl);
                    }
                })
                .finally(() => {
                    retries += 1;
                });
            }, this.pollInterval);
        });
    }
}
