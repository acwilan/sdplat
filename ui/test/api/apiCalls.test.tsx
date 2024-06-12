import { BeamClient } from '../../src/api/beam';
import { beamApiCall } from '../../src/api/apiCalls';
import { FormData } from '../../src/components/FormComponent';

jest.mock('../../src/api/beam', () => {
  return {
    BeamClient: jest.fn().mockImplementation(() => ({
      textPrompt: jest.fn().mockResolvedValue('mockTaskId'),
      pollTaskStatus: jest.fn().mockResolvedValue('mockTaskResult'),
    })),
  };
});

describe('beamApiCall', () => {

  it('should call BeamClient and return the result', async () => {

    const formData: FormData = {
      prompt: 'Test prompt',
      height: '256',
      width: '256',
      negativePrompt: 'Negative prompt',
      model: 'testModel',
    };

    const result = await beamApiCall(formData);

    expect(result).toBe('mockTaskResult');
  });

  it('should handle missing optional fields', async () => {

    const formData: FormData = {
      prompt: 'Test prompt',
      height: '',
      width: '',
      negativePrompt: '',
      model: 'testModel',
    };

    const result = await beamApiCall(formData);

    expect(result).toBe('mockTaskResult');
  });
});
