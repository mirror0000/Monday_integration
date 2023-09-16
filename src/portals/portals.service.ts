import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class PortalsService {
  private readonly base_url = 'https://api.monday.com/v2';
  constructor(private readonly httpService: HttpService,
    private readonly configService: ConfigService, ) {}

  async addTimeLogForTasks(req) {
    const { cardId } = req.params;
    const { duration, status, description } = req.body;
    const url = `https://api.monday.com/v2`;
    const text = `${description} \n ${duration}s`
    const query1 = `mutation  { move_item_to_group ( item_id: ${cardId}, group_id: ${status}) { id}  }`;
    const query2 = `mutation {create_update (item_id: ${cardId}, body: "${text}") {id}}`;
    console.log('query2', query2);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: req.headers.access_token
    };

    try{

      const res_status = await this.httpService.axiosRef.post(url, {query: query1}, {
        headers: headers,
      });
      const data_status = res_status.data;

      const res_time = await this.httpService.axiosRef.post(url, {query: query2}, {
        headers: headers
      });
      const data_time = res_time.data;
      return {data_status, data_time};
    } catch(error) {
      return error;
    }
  }

  async getAllWorkspaces(req: any) {
    const query = 'query { workspaces {id name kind description state }}';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: req.query.access_token
    }
    const response = await fetch(this.base_url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({query: query})
    });
    const json = await response.json();
    console.log('all workspaces:', json);
    return json;
  }

  async getAllBoards(req: any) {
    if (!req.query.ids) {
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: req.query.access_token
    }
    const data : any = [];
    for (let id of req.query.ids) {
        const query = `query { boards (workspace_ids : ${id}) { name state id permissions }}`;
        const response = await fetch(this.base_url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            query: query
          })
        });
        const json = await response.json();
        const temp = {
          org_id: id,
          board: json.data.boards
        }
        data.push(temp);
    }
    console.log('boards: ', data);
    return data;
  }

  async getAllTasksOfLists(req: any) {
    if (!req.query.ids) {
      return;
    }
    const data : any = [];
    const headers = {
      'Content-Type': 'application/json',
      Authorization: req.query.access_token
    }
    for (let item of req.query.ids) {
        const query = `query {groups (ids: ${item.id}) {items {id name}}}`;
        const response = await this.httpService.axiosRef.post(this.base_url, query, {
          headers: headers
        });
        const json = await response.data;
        const temp = {
          list_id: item.id,
          list_name: item.name,
          card: json
        }
        data.push(temp);
    }
    console.log('getAllTasksOfLists', data);

    return data;
  }

  async getAllGroupsOfBoard(req: any) {
    const {boardID} = req.params;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': req.query.access_token
    };
    const query = `query {boards (ids: ${boardID}) {groups {title id items {id name state}}}}`;
    const data = JSON.stringify({
      query: query
    });
    const response = await this.httpService.axiosRef.post(this.base_url, data, {
      headers: headers
    });
    const json = response.data;
    console.log('get all groups ', json);
    return json.data;
  }
}
