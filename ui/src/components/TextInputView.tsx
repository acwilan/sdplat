import React, { useState } from "react";
import { FormComponent, FormData, ModelInfo } from "./FormComponent";
import OutputView from "./OutputView";

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

    const [ imgUrl, setImgUrl ] = useState<string>('');
    const [ outputMessage, setOutputMessage ] = useState<string>('');
    const [ messageType, setMessageType ] = useState<'success' | 'danger' | 'info'>();

    const formSubmitted = async (formData: FormData) => {
        setImgUrl('');
        setOutputMessage('Loading');
        setMessageType('info');
        return apiCall(formData).then(url => {
            setImgUrl(url);
            setOutputMessage("Here's your image");
            setMessageType('success');
        }).catch(e => {
            setOutputMessage(`There was an error: ${JSON.stringify(e)}`);
            setMessageType('danger');
        });
    }

    const formCleared = () => {
        setImgUrl('');
        setOutputMessage('');
    }
    
    return (
        <>
            <FormComponent title={title} submitHandler={formSubmitted} clearHandler={formCleared} models={sortedModels} />
            <OutputView message={outputMessage} messageType={messageType} imageUrl={imgUrl} />
        </>
    );
}

export default TextInputView; 