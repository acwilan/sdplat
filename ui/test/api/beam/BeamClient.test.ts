import { BeamClient, TextPromptRequest } from '../../../src/api/beam';

// Mocking fetch
const fetchMock = jest.fn();
global.fetch = fetchMock as any;

describe('BeamClient', () => {
    let client: BeamClient;
    const authToken = 'testAuthToken';
    const pollInterval = 1; // Very short interval for testing

    beforeEach(() => {
        client = new BeamClient({ authToken, pollInterval });
        fetchMock.mockClear();
    });

    describe('txt2img', () => {
        it('should return task_id on success', async () => {
            const appId = 'testAppId';
            const request: TextPromptRequest = { prompt: 'test prompt' };
            const taskId = '12345';

            fetchMock.mockResolvedValueOnce({
                status: 200,
                json: async () => ({ task_id: taskId }),
            });

            const result = await client.textPrompt(appId, request);

            expect(fetchMock).toHaveBeenCalledWith(
                `https://${appId}.apps.beam.cloud`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                }),
            );

            expect(result).toBe(taskId);
        });

        it('should throw an error on invalid response status', async () => {
            const appId = 'testAppId';
            const request: TextPromptRequest = { prompt: 'test prompt' };

            fetchMock.mockResolvedValueOnce({
                status: 400,
            });

            await expect(client.textPrompt(appId, request)).rejects.toThrow('Invalid response 400');
        });
    });

    describe('pollTaskStatus', () => {
        it('should return image URL on COMPLETE status', async () => {
            const taskId = 'testTaskId';
            const imageUrl = 'https://example.com/output.png';

            fetchMock.mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ status: 'PENDING' }),
                }),
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ status: 'COMPLETE', outputs: { './output.png': { url: imageUrl } } }),
                }),
            );

            const result = await client.pollTaskStatus(taskId);

            expect(fetchMock).toHaveBeenCalledWith(
                `https://api.beam.cloud/v1/task/${taskId}/status/`,
                expect.objectContaining({
                    headers: {
                        'Authorization': `Basic ${authToken}`,
                    },
                }),
            );

            expect(result).toBe(imageUrl);
        });

        it('should reject on error status', async () => {
            const taskId = 'testTaskId';

            fetchMock.mockResolvedValueOnce({
                json: async () => ({ status: 'FAILED' }),
            });

            await expect(client.pollTaskStatus(taskId)).rejects.toBe('FAILED');
        });

        it('should reject on fetch error', async () => {
            const taskId = 'testTaskId';

            fetchMock.mockImplementation(() => Promise.reject(new Error('Network error')));

            await expect(client.pollTaskStatus(taskId)).rejects.toThrow('Network error');
        });
    });
});
