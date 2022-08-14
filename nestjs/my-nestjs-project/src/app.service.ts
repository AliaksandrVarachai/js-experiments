import {Injectable, Req, RequestMethod} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IRequestWithRecipientUrl } from './app.middleware';

@Injectable()
export class BffService {
  constructor(private readonly httpService: HttpService) {}

  async all(@Req() req: IRequestWithRecipientUrl): Promise<any> {
    const isBody = Object.keys(req.body || {}).length > 0;
    const authorizationHeader = req.get('authorization');
    const axiosRequest = {
      method: req.method,
      url: req.recipientUrl,
      ...(isBody && { data: req.body }),
      headers: {
        ...(authorizationHeader && { Authorization: authorizationHeader })
      }
    };
    try {
      const response = await this.httpService.axiosRef(axiosRequest);
      const { error, data } = response.data;
      if (error) {
        console.log('**************** ERROR', error);
        return error;
      }
      if (data) {
        console.log('**************** DATA', data);
        return data;
      }
      return response.data;
    } catch (error) {
      console.log('**************** ERROR', error);
      return '99999'
      if (error.response) {
        const { status, data } = error.response;
        // res.status(status).json(data);
      } else {
        // res.status(500).json({ error: error.message });
      }
    }
    // console.log('******************** axiosRequest=', axiosRequest)
    // const response = await this.httpService.axiosRef(axiosRequest);
    // console.log(response.data);
    // return response.data;
  }
}
