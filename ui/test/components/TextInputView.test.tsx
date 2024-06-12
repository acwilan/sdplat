import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInputView from '../../src/components/TextInputView';
import { FormComponent, FormData } from '../../src/components/FormComponent';
import { config } from '../../../conf/sdConfig';

jest.mock('../../src/components/FormComponent', () => ({
    FormComponent: jest.fn(() => null),
}));

const mockFetch = jest.fn();

const { models } = config.beam;

global.fetch = mockFetch;

describe('TextInputView Component', () => {

    const apiCall = jest.fn().mockImplementation((formData: FormData) => {
        return new Promise((resolve, reject) => {
            if (formData.prompt === 'test prompt') {
                resolve('https://example.com/image.jpg');
            } else {
                reject(new Error('API call failed'));
            }
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders FormComponent with correct props', () => {
        render(<TextInputView title='' modelTarget='txt2img' apiCall={apiCall} models={models} />);
        expect(FormComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                submitHandler: expect.any(Function),
                clearHandler: expect.any(Function),
                models: Object.entries(models)
                    .map(([id, model]) => ({
                        id,
                        name: model.name,
                        targets: model.targets
                    }))
                    .filter(model => model.targets.some((target: string) => target === 'txt2img'))
                    .sort((a, b) => a.name.localeCompare(b.name)),
            }),
            {}
        );
    });

    test('handles form submission successfully', async () => {
        render(<TextInputView title='' modelTarget='txt2img' apiCall={apiCall} models={models} />);

        // Ensure FormComponent is called with correct props
        expect(FormComponent).toHaveBeenCalledWith(expect.objectContaining({
            submitHandler: expect.any(Function),
            clearHandler: expect.any(Function),
            models: expect.any(Array),
        }), {});

        const submitHandler = (FormComponent as jest.Mock).mock.calls[0][0].submitHandler as (formData: FormData) => Promise<void>;
        const formData: FormData = { prompt: 'test prompt', model: Object.keys(models)[0], height: '', width: '', negativePrompt: '' };

        // Log to ensure the submitHandler is called
        // console.log('Calling submitHandler with formData:', formData);

        await act(async () => submitHandler(formData));

        expect(apiCall).toHaveBeenCalledTimes(1);
        expect(apiCall).toHaveBeenCalledWith(formData);

        await waitFor(() => {
            expect(screen.getByText("Here's your image")).toBeInTheDocument();
            expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
        });
    });

    test('handles form submission failure', async () => {
        render(<TextInputView title='' modelTarget='txt2img' apiCall={apiCall} models={models} />);

        const submitHandler = (FormComponent as jest.Mock).mock.calls[0][0].submitHandler as (formData: FormData) => Promise<void>;
        const formData: FormData = { prompt: 'error prompt', model: Object.keys(models)[0], height: '', width: '', negativePrompt: '' };

        // Log to ensure the submitHandler is called
        // console.log('Calling submitHandler with formData:', formData);

        await act(async () => submitHandler(formData));

        expect(apiCall).toHaveBeenCalledTimes(1);
        expect(apiCall).toHaveBeenCalledWith(formData);

        expect(mockFetch).toHaveBeenCalledTimes(0);

        await waitFor(() => {
            expect(screen.getByText(/There was an error:/)).toBeInTheDocument();
        });
    });

    test('handles form clearing', () => {
        render(<TextInputView title='' modelTarget='txt2img' apiCall={apiCall} models={models} />);

        const clearHandler = (FormComponent as jest.Mock).mock.calls[0][0].clearHandler as () => void;

        clearHandler();

        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});
