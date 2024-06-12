import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Txt2Img from '../../src/components/Txt2Img';
import { FormComponent, FormData } from '../../src/components/FormComponent';
import { config } from '../../../conf/sdConfig';

jest.mock('../../src/components/FormComponent', () => ({
    FormComponent: jest.fn(() => null),
}));

const mockFetch = jest.fn();

const { models } = config.beam;

global.fetch = mockFetch;

describe('Txt2Img Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders FormComponent with correct props', () => {
        render(<Txt2Img pathSegment='' />);
        expect(FormComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                submitHandler: expect.any(Function),
                clearHandler: expect.any(Function),
                models: Object.entries(models)
                    .map(([id, model]) => ({
                        id,
                        name: model.name
                    })).sort((a, b) => a.name.localeCompare(b.name)),
            }),
            {}
        );
    });

    test('handles form submission successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({ task_id: 'task-id' })
        }).mockResolvedValueOnce({
            json: async () => ({ status: 'COMPLETE', outputs: { './output.png': { url: 'https://example.com/image.jpg' } } })
        });

        render(<Txt2Img pathSegment='' />);

        const submitHandler = (FormComponent as jest.Mock).mock.calls[0][0].submitHandler as (formData: FormData) => Promise<void>;
        const formData: FormData = { prompt: 'test prompt', model: Object.keys(models)[0], height: '', width: '', negativePrompt: '' };

        await act(async () => submitHandler(formData));

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Authorization': expect.any(String),
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ prompt: 'test prompt' })
        }));
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `https://api.beam.cloud/v1/task/task-id/status/`,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': expect.any(String),
                    }),
                })
            );
        });

        expect(screen.getByText("Here's your image")).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    test('handles form submission failure', async () => {
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({ task_id: 'task-id' })
        }).mockResolvedValueOnce({
            json: async () => ({ status: 'ERROR', message: 'test error' })
        });

        render(<Txt2Img pathSegment='' />);

        const submitHandler = (FormComponent as jest.Mock).mock.calls[0][0].submitHandler as (formData: FormData) => Promise<void>;
        const formData: FormData = { prompt: 'test prompt', model: Object.keys(models)[0], height: '', width: '', negativePrompt: '' };

        await act(async () => submitHandler(formData));

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Authorization': expect.any(String),
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ prompt: 'test prompt' })
        }));
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `https://api.beam.cloud/v1/task/task-id/status/`,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': expect.any(String),
                    }),
                })
            );
        });

        expect(screen.getByText('There was an error: "ERROR"')).toBeInTheDocument();
    });

    test('handles form clearing', () => {
        render(<Txt2Img pathSegment='' />);

        const clearHandler = (FormComponent as jest.Mock).mock.calls[0][0].clearHandler as () => void;

        clearHandler();

        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});
