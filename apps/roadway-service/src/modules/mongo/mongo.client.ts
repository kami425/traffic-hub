import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient as Client, Db } from 'mongodb';
import { Model } from 'mongoose';

import {
  EventDocument,
  Pattern,
  PatternDocument,
  Road,
  RoadDocument,
  Schedule,
  ScheduleDocument,
} from '../../schemas';

@Injectable()
export class MongoClient implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private db: Db;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Road.name) private roadModel: Model<RoadDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Pattern.name) private patternModel: Model<PatternDocument>,
  ) {}

  async onModuleInit() {
    const databaseUrl = this.configService.getOrThrow<string>('DATABASE_URL');

    this.client = new Client(databaseUrl, {});

    await this.client.connect();

    const dbName =
      this.configService.get<string>('DATABASE_NAME') ||
      this.getDatabaseNameFromUrl(databaseUrl);

    this.db = this.client.db(dbName);
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getDb(): Db {
    return this.db;
  }

  Roads() {
    return this.roadModel;
  }

  Events() {
    return this.eventModel;
  }

  Schedules() {
    return this.scheduleModel;
  }

  Patterns() {
    return this.patternModel;
  }

  private getDatabaseNameFromUrl(url: string) {
    const parsed = new URL(url);
    const dbName = parsed.pathname.replace('/', '');

    if (!dbName) {
      throw new Error(`Can't get database name`);
    }

    return dbName;
  }
}
