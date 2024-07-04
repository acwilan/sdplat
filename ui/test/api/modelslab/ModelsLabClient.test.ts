import ModelsLabClient from '../../../src/api/modelslab/ModelsLabClient'
import TextPromptRequest from '../../../src/api/TextPromptRequest'

// Mocking fetch
const fetchMock = jest.fn()
global.fetch = fetchMock as any

describe('ModelsLabClient', () => {
    let client: ModelsLabClient
    const apiKey = 'testApiKey'
    const pollInterval = 1; // Very short interval for testing

    beforeEach(() => {
        client = new ModelsLabClient({ apiKey, pollInterval })
        fetchMock.mockClear()
    })

    describe('textPrompt', () => {
        it('should return task_id on success', async () => {
            const request: TextPromptRequest = { prompt: 'test prompt' }
            const imgUrl = 'imgUrl'
            const mockResponse = { img_url: imgUrl };

            fetchMock.mockResolvedValueOnce({
                status: 200,
                json: async () => (mockResponse),
            })

            const result = await client.textPrompt(request)

            expect(fetchMock).toHaveBeenCalledWith(
                `https://modelslab.com/api/v3/text2img`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                }),
            )

            expect(result).toBe(mockResponse);
        })

        it('should throw an error on invalid response status', async () => {
            const request: TextPromptRequest = { prompt: 'test prompt' }

            fetchMock.mockResolvedValueOnce({
                status: 400,
            })

            await expect(client.textPrompt(request)).rejects.toThrow('Invalid response 400')
        })
    })

    describe('pollTaskStatus', () => {
        it('should return image URL on COMPLETE status', async () => {
            const imgUrl = 'https://example.com/output.png'

            fetchMock.mockImplementationOnce(() =>
                Promise.resolve({
                    status: 404
                }),
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    status: 200
                }),
            )

            const result = await client.pollImageStatus(imgUrl)

            expect(fetchMock).toHaveBeenCalledWith(
                imgUrl,
                expect.objectContaining({
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }),
            )

            expect(result).toBe(imgUrl)
        })

        it('should reject on error status', async () => {
            const imgUrl = 'https://example.com/output.png'

            fetchMock.mockResolvedValue({
                status: 404
            })

            await expect(client.pollImageStatus(imgUrl)).rejects.toThrow(`Max retries exceeded for image ${imgUrl}`)
        })
    })
})