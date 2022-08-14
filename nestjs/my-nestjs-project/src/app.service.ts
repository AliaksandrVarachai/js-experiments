import { Injectable, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { IRequestWithRecipientUrl } from './app.middleware';

@Injectable()
export class BffService {
  constructor(private readonly httpService: HttpService) {}

  async all(@Req() req: IRequestWithRecipientUrl, @Res() res: Response): Promise<any> {
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
      const axiosResponse = await this.httpService.axiosRef(axiosRequest);
      res.status(axiosResponse.status)
      const { error, data } = axiosResponse.data;
      if (error) return res.json(error);
      if (data) return res.json(data);
      return res.json(axiosResponse.data);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        return res.status(status).json(data);
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
