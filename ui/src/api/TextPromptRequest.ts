
export default interface TextPromptRequest {
    prompt: string;
    negative_prompt?: string | undefined;
    height?: number | undefined;
    width?: number | undefined;
    transcript?: string | undefined;
}
