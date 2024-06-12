// apiCalls.ts
import { BeamClient, TextPromptRequest } from "./beam";
import { config } from '../../../conf/sdConfig';
import { FormData } from '../components/FormComponent';

const { authToken } = config.beam;

export const beamApiCall = (formData: FormData): Promise<string> => {
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
  const beamAppId: string  = formData.model;
  const beamClient = new BeamClient({ authToken });
  return beamClient.textPrompt(beamAppId, request)
    .then(taskId => beamClient.pollTaskStatus(taskId));
}
