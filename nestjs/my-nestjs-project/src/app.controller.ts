import { All, Controller, Req, Headers } from '@nestjs/common';
import { BffService } from './app.service';
import { IRequestWithRecipientUrl } from './app.middleware';

@Controller('/*')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @All()
  async all(@Req() req: IRequestWithRecipientUrl, @Headers() headers): Promise<any> {
    console.log(headers.connection) // TODO: use with Authorizaiton header
    return this.bffService.all(req);
  }
}


