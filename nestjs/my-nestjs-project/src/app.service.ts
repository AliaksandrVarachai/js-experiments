import { Injectable, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IRequestWithRecipientUrl } from './app.middleware';

@Injectable()
export class BffService {
  constructor(private readonly httpService: HttpService) {}

  async all(@Req() req: IRequestWithRecipientUrl): Promise<any> {
    const response = await this.httpService.axiosRef.get(req.recipientUrl);
    console.log(response.data);
    return response.data;
  }
}
