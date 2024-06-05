export interface Txt2ImgRequest {
    prompt: string;
    negative_prompt?: string | undefined;
    height?: number | undefined;
    width?: number | undefined;
}

export class BeamClient {
    private authToken: string;
    private pollInterval: number;

    public constructor(params: { authToken: string, pollInterval?: number }) {
        this.authToken = params.authToken;
        this.pollInterval = params.pollInterval || 3000;
    }

    public async txt2img(appId: string, params: Txt2ImgRequest): Promise<string> {
        const url = `https://${appId}.apps.beam.cloud`;
        const authHeader = `Basic ${this.authToken}`;
        return fetch(
            url, {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }
        ).then(response => {
          if (response.status !== 200) {
            throw new Error(`Invalid response ${response.status}`);
          }
          return response.json();
        }).then(data => data.task_id);
    }

    public async pollTaskStatus(taskId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const statusUrl = `https://api.beam.cloud/v1/task/${taskId}/status/`;
            const poll = setInterval(() => {
                fetch(statusUrl, {
                    headers: {
                    'Authorization': `Basic ${this.authToken}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'COMPLETE') {
                        clearInterval(poll);
                        return resolve(data.outputs['./output.png'].url);
                    }
                    if (data.status !== 'PENDING' && data.status !== 'RUNNING') {
                        reject(data.status);
                    }
                })
                .catch(error => {
                    clearInterval(poll);
                    reject(error);
                });
            }, this.pollInterval);
        });
    }
}
