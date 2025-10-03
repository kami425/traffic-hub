import { Injectable, Logger } from '@nestjs/common';

import { MongoClient, } from '../mongo/mongo.client';
import { RedisClient } from '@traffic-hub/shared';
import { REDIS } from '../../utils/constants';
import { Road } from '../../schemas';
import { RoadInputDto } from '../../types/road/DTOs/road-input.dto';

@Injectable()
export class RoadService {
  constructor(
    private readonly mongoService: MongoClient,
    private readonly redisClient: RedisClient,
  ) {}

  async getAll(page: number, pageSize: number) {
    const roads = this.mongoService.Roads();

    let count: number;
    const countString = await this.redisClient.get(REDIS.ROADS.COUNT);
    if (countString) {
      count = +countString;
    } else {
      count = await roads.countDocuments();
    }

    const pageFeed = roads
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
        total: count,
        pages: Math.ceil(count / pageSize),
        data: pageFeed
    }
  }

  async getSingle(id: string){
    const roads = this.mongoService.Roads();

    let road: Road | null;
    const roadStrig = await this.redisClient.get(REDIS.ROADS.SINGLE.replace('_ID', id));
    if(roadStrig){
        road = JSON.parse(roadStrig) as Road;
    }else{
        road = await roads.findById(id);
    }

    return road;
  }

  async create(model: RoadInputDto){
    const roads = this.mongoService.Roads();

    const road = await roads.create(model);

    Logger.log(`road-service => RoadService => create: A new road created: ${JSON.stringify(road)}`)

    return road;
  }

  async edit(id: string, model:RoadInputDto){
    const roads = this.mongoService.Roads();
    
    const road = await roads.findByIdAndUpdate(id, model);

    Logger.log(`road-service => RoadService => edit: A road updated: ${JSON.stringify(road)}`)

    return road;
  }

  async remove(id: string){
    const roads = this.mongoService.Roads();
    
    const road = await roads.findByIdAndDelete(id);

    Logger.log(`road-service => RoadService => remove: A road removed: ${JSON.stringify(road)}`)

    return road;
  }
}
