import { createProxyMiddleware } from 'http-proxy-middleware';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnProxyReqCallback,
  OnProxyResCallback,
} from 'http-proxy-middleware/dist/types';

import { ResponseDto } from '@traffic-hub/shared';

const safeJSONParse = (input: string) => {
    if (!input) {
        return null;
    }
    
    try {
        return JSON.parse(input);
    } catch (e) {
        return input;
    }
};

const proxyResCallback: OnProxyResCallback = async (proxyRes, req, res) => {
  let body = '';
  proxyRes.on('data', (chunk) => {
    body += chunk;
  });

  proxyRes.on('end', () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let statusCode = proxyRes.statusCode!;
      const data = safeJSONParse(body);

      // Change default shape of error object of NestJS  to project default shape
      if(data.status && data.response && data.message && data.name){
        statusCode = data.status;
      }

      const successFlag = statusCode >= 200 && statusCode < 300;

      const response: ResponseDto = {
        success: successFlag,
        data: successFlag ? data : null,
        message: successFlag ? null : data?.message || 'Unexpected error',
      };

      res.status(statusCode).json(response);
    } catch(err) {
      Logger.error(err);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Invalid response from service',
      } satisfies ResponseDto);
    }
  });
};

export function proxyConfiguration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: INestApplication<any>,
  globalPrefix: string
) {
  const configService = app.get(ConfigService);
  const userServiceUrl = configService.get<string>('USER_SERVICE_URL');
  const roadwayServiceUrl = configService.get<string>('ROADWAY_SERVICE_URL');

  app.use(
    `/${globalPrefix}/user`,
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathRewrite: { [`^/${globalPrefix}/user`]: '' },
      selfHandleResponse: true,
      onProxyRes: proxyResCallback,
    })
  );

  app.use(
    `/${globalPrefix}/roadway`,
    createProxyMiddleware({
      target: roadwayServiceUrl,
      changeOrigin: true,
      pathRewrite: { [`^/${globalPrefix}/roadway`]: '' },
      selfHandleResponse: true,
      onProxyRes: proxyResCallback,
    })
  );
}
