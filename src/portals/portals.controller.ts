import { Body, Controller, Get, Post, Req, Param, UseGuards } from '@nestjs/common';
import { PortalsService } from './portals.service';

@Controller('portals')
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Get('workspaces/all')
  async getAllWorkspaces(@Req() req) {
    const workspaces: any = await this.portalsService.getAllWorkspaces(req);
    return workspaces.data;
  }

  @Get('boards')
  async getAllBoards (@Req() req) {
    if (!req.query.ids) {
      return;
    }
    const boards: any = await this.portalsService.getAllBoards(req);
    return boards;
  }

  @Get('tasks')
  async getAllTasksOfLists(@Req() req) {
    try {
      const tasks: any = await this.portalsService.getAllTasksOfLists(req);
      return tasks;
    }
    catch(error) {
      console.log('list issue error', error);
      return error;
    }
  }

  @Get(':boardID/groups')
  async getAllGroupsOfBoard(@Req() req) {
    try {
      const groups: any = await this.portalsService.getAllGroupsOfBoard(req);
      return groups;
    } catch(error) {
      console.log('board error', error);
      return error;
    }
  }

  @Post(':cardId/log')
  async addTimeLogForTasks(@Req() req) {
    try {
      const log: any = await this.portalsService.addTimeLogForTasks(req);
      console.log('add time: ', log);
      return log;
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

}
