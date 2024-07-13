import React, { useState } from "react";
import { FormComponent, FormData, ModelInfo } from "./FormComponent";
import OutputView, { OutputType } from "./OutputView";
import useLastSegment from "../hooks/use-last-segment";

interface TextInputViewProps {
    title: string;
    modelTarget: string;
    apiCall: (formData: FormData) => Promise<string>;
    models: { [ modelId: string]: any };
}

const TextInputView: React.FC<TextInputViewProps> = ({ title, modelTarget, apiCall, models }) => {
    const sortedModels: ModelInfo[] = Object.entries(models)
        .map(([id, model]) => ({
            id,
            name: model.name,
            targets: model.targets
        })).filter(model => model.targets.some((target: string) => target === modelTarget))
        .sort((a: ModelInfo, b: ModelInfo) => a.name.localeCompare(b.name));
    const modelMap: { [id: string ]: ModelInfo} = sortedModels.reduce((map, model) => {
        map[model.id] = model;
        return map;
    }, {} as { [id: string]: ModelInfo });

    const lastSegment = useLastSegment();
    const outputType: OutputType = (lastSegment === 'txt2aud' || lastSegment === 'txt2spch')
        ? OutputType.AUDIO 
        : OutputType.IMAGE;

    const [ outputUrl, setOutputUrl ] = useState<string>('');
    const [ outputMessage, setOutputMessage ] = useState<string>('');
    const [ messageType, setMessageType ] = useState<'success' | 'danger' | 'info'>();

    const formSubmitted = async (formData: FormData) => {
        setOutputUrl('');
        setOutputMessage('Loading');
        setMessageType('info');
        return apiCall(formData).then(url => {
            setOutputUrl(url);
            setOutputMessage("Here's your result");
            setMessageType('success');
        }).catch(e => {
            setOutputMessage(`There was an error: ${JSON.stringify(e)}`);
            setMessageType('danger');
        });
    }

    const formCleared = () => {
        setOutputUrl('');
        setOutputMessage('');
    }
    
    return (
        <>
            <FormComponent title={title} submitHandler={formSubmitted} clearHandler={formCleared} models={sortedModels} />
            <OutputView message={outputMessage} messageType={messageType} outputType={outputType} outputUrl={outputUrl} />
        </>
    );
}

export default TextInputView; 