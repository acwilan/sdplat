// apiCall.ts
import { config } from '../../../../conf/sdConfig';
import { FormData } from '../../components/FormComponent';
import TextPromptRequest from "../TextPromptRequest";
import ModelsLabClient, { TextPromptResponse } from './ModelsLabClient';

const { apiKey } = config.modelsLab;

export const modelsLabApiCall = (formData: FormData): Promise<string> => {
  const request: TextPromptRequest = {
    prompt: formData.prompt,
  }
  if (formData.height && formData.height.trim().length > 0) {
    request.height = parseInt(formData.height);
  }
  if (formData.width && formData.width.trim().length > 0) {
    request.width = parseInt(formData.width);
  }
  if (formData.negativePrompt && formData.negativePrompt.trim().length > 0) {
    request.negative_prompt = formData.negativePrompt;
  }
  const apiClient = new ModelsLabClient({ apiKey });
  return apiClient.textPrompt({
        ...request,
        key: apiKey,
        safety_checker: false
    })
    .then((response: TextPromptResponse) => {
        if (response.status !== 'success' && response.status !== 'processing') {
            throw new Error(`Invalid response ${response.status}: ${response.message}`);
        }
        return response.output[0];
    })
    .then(imgUrl => apiClient.pollImageStatus(imgUrl));
}
