import React, { useState } from "react";
import { FormComponent, FormData, ModelInfo } from "./FormComponent";
import { BeamClient, Txt2ImgRequest } from "../api";
import { config } from '../../../conf/sdConfig';
import OutputView from "./OutputView";
import { PathComponentProps } from "../types";

const { authToken, models } = config.beam;
const sortedModels: ModelInfo[] = Object.entries(models)
    .map(([id, model]) => ({
        id,
        name: model.name
    })).sort((a: ModelInfo, b: ModelInfo) => a.name.localeCompare(b.name));
const modelMap: { [id: string ]: ModelInfo} = sortedModels.reduce((map, model) => {
    map[model.id] = model;
    return map;
}, {} as { [id: string]: ModelInfo });

const Txt2Img: React.FC<PathComponentProps> = ({ pathSegment }) => {
    const [ imgUrl, setImgUrl ] = useState<string>('');
    const [ outputMessage, setOutputMessage ] = useState<string>('');
    const [ messageType, setMessageType ] = useState<'success' | 'danger' | 'info'>();

    const formSubmitted = async (formData: FormData) => {
        setImgUrl('');
        setOutputMessage('Loading');
        setMessageType('info');
        const request: Txt2ImgRequest = {
            prompt: formData.prompt,
        }
        const beamAppId: string  = modelMap[formData.model].beamId || '';
        const beamClient = new BeamClient({ authToken });
        const taskId: string = await beamClient.txt2img(beamAppId, request)
        return beamClient.pollTaskStatus(taskId)
            .then(url => {
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
            <FormComponent submitHandler={formSubmitted} clearHandler={formCleared} models={sortedModels} />
            <OutputView message={outputMessage} messageType={messageType} imageUrl={imgUrl} />
        </>
    );
}

export default Txt2Img; 