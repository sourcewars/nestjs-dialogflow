import { Body, Controller, HttpStatus, RequestMethod, Res } from '@nestjs/common';
import { DialogFlowResponse } from '../interfaces/dialog-flow-response.interface';
import { DialogFlowProvider } from './dialog-flow.provider';
import { METHOD_METADATA, PATH_METADATA } from '../constant';
import { WebHookConfig } from '../interfaces/web-hook-config.interface';

@Controller()
export class DialogFlowController {
	constructor(private readonly dialogFlowProvider: DialogFlowProvider) {}

	public static forRoot(webHookConfig: WebHookConfig) {
		Reflect.defineMetadata(PATH_METADATA, webHookConfig.basePath, DialogFlowController);
		Reflect.defineMetadata(
			PATH_METADATA,
			webHookConfig.postPath,
			Object.getOwnPropertyDescriptor(DialogFlowController.prototype, 'dialogFlowWebHook').value,
		);
		Reflect.defineMetadata(
			METHOD_METADATA,
			RequestMethod.POST,
			Object.getOwnPropertyDescriptor(DialogFlowController.prototype, 'dialogFlowWebHook').value,
		);
		return DialogFlowController;
	}

	async dialogFlowWebHook(@Body() dialogFlowResponse: DialogFlowResponse, @Res() res) {
		const fulfillment = await this.dialogFlowProvider.handleIntentOrAction(dialogFlowResponse);
		return res.status(HttpStatus.OK).send(fulfillment);
	}
}
