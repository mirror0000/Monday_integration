import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class AuthsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, 
  ) {}

  getLoginUrl() {
    const state = Math.random().toString();
    const client_id = this.configService.get('MONDAY_CLIENT_ID');
    const redirect_uri = this.configService.get('MONDAY_CALLBACK_URL');
    return `https://auth.monday.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;
  }

  async authorize(code: string) {
    const url = 'https://auth.monday.com/oauth2/token';
    const client_id = this.configService.get('MONDAY_CLIENT_ID');
    const client_secret = this.configService.get('MONDAY_CLINET_SECRET');
    const redirect_uri = this.configService.get('MONDAY_CALLBACK_URL');
    const params = {
      client_id,
      client_secret,
      code: code,
      redirect_uri,
    };

    console.log('authorize data', params);

    const response = await this.httpService.axiosRef.post(url, null, {
      params: params
    });
    console.log('authorize json', response.data);
    return response.data;
  }

  async getProfile(access_token: string) {
    const url = 'https://api.monday.com/v2';

    console.log('access_token', access_token);

    const headers = {
      Authorization: access_token,
      'Content-Type': 'application/json'
    };
    const query = "query { me { is_guest created_at name id}}";
    
    const response = await fetch( url,
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          query: query
        })
      }
    );

    const data = await response.json();

    console.log('getProfile: ', data);
    return data;
  }
}
