import { All, Controller, Req, Res } from '@nestjs/common';
import { BffService } from './app.service';
import { IRequestWithRecipientUrl } from './app.middleware';

@Controller('/*')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @All()
  async all(@Req() req: IRequestWithRecipientUrl, @Res() res): Promise<any> {
    return this.bffService.all(req, res);
  }
}


