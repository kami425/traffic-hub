/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const road_module_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(8);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/traffic-hub-roadway'),
            config_1.ConfigModule.forRoot(),
            road_module_1.RoadModule,
        ],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const road_controller_1 = __webpack_require__(7);
const road_service_1 = __webpack_require__(11);
const mongo_module_1 = __webpack_require__(31);
const shared_1 = __webpack_require__(21);
let RoadModule = class RoadModule {
};
exports.RoadModule = RoadModule;
exports.RoadModule = RoadModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongo_module_1.MongoModule, shared_1.SharedModule],
        controllers: [road_controller_1.RoadController],
        providers: [road_service_1.RoadService],
    })
], RoadModule);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadController = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const road_input_dto_1 = __webpack_require__(9);
const road_service_1 = __webpack_require__(11);
const nest_keycloak_connect_1 = __webpack_require__(28);
const OptionalParseIntPipe = new common_1.ParseIntPipe({ optional: true });
let RoadController = class RoadController {
    constructor(roadService) {
        this.roadService = roadService;
    }
    getAll(page, pageSize) {
        this.roadService.getAll(page || 1, pageSize || 10);
    }
    getSingle(id) {
        this.roadService.getSingle(id);
    }
    create(model) {
        this.roadService.create(model);
    }
    edit(id, model) {
        this.roadService.edit(id, model);
    }
    remove(id) {
        this.roadService.remove(id);
    }
};
exports.RoadController = RoadController;
tslib_1.__decorate([
    (0, nest_keycloak_connect_1.Public)(),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('page', OptionalParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('pageSize', OptionalParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RoadController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, nest_keycloak_connect_1.Public)(),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', mongoose_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], RoadController.prototype, "getSingle", null);
tslib_1.__decorate([
    (0, nest_keycloak_connect_1.Roles)({ roles: ['admin'] }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof road_input_dto_1.RoadInputDto !== "undefined" && road_input_dto_1.RoadInputDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RoadController.prototype, "create", null);
tslib_1.__decorate([
    (0, nest_keycloak_connect_1.Roles)({ roles: ['admin'] }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', mongoose_1.ParseObjectIdPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof road_input_dto_1.RoadInputDto !== "undefined" && road_input_dto_1.RoadInputDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RoadController.prototype, "edit", null);
tslib_1.__decorate([
    (0, nest_keycloak_connect_1.Roles)({ roles: ['admin'] }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', mongoose_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], RoadController.prototype, "remove", null);
exports.RoadController = RoadController = tslib_1.__decorate([
    (0, common_1.Controller)('road'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof road_service_1.RoadService !== "undefined" && road_service_1.RoadService) === "function" ? _a : Object])
], RoadController);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadInputDto = void 0;
const tslib_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(10);
class RoadInputDto {
}
exports.RoadInputDto = RoadInputDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 50),
    tslib_1.__metadata("design:type", String)
], RoadInputDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Boolean)
], RoadInputDto.prototype, "isOpen", void 0);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadService = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const mongo_service_1 = __webpack_require__(12);
const shared_1 = __webpack_require__(21);
const constants_1 = __webpack_require__(30);
let RoadService = class RoadService {
    constructor(mongoService, redisClient) {
        this.mongoService = mongoService;
        this.redisClient = redisClient;
    }
    async getAll(page, pageSize) {
        const roads = this.mongoService.Roads();
        let count;
        const countString = await this.redisClient.get(constants_1.REDIS.ROADS.COUNT);
        if (countString) {
            count = +countString;
        }
        else {
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
        };
    }
    async getSingle(id) {
        const roads = this.mongoService.Roads();
        let road;
        const roadStrig = await this.redisClient.get(constants_1.REDIS.ROADS.SINGLE.replace('_ID', id));
        if (roadStrig) {
            road = JSON.parse(roadStrig);
        }
        else {
            road = await roads.findById(id);
        }
        return road;
    }
    async create(model) {
        const roads = this.mongoService.Roads();
        const road = await roads.create(model);
        common_1.Logger.log(`road-service => RoadService => create: A new road created: ${JSON.stringify(road)}`);
        return road;
    }
    async edit(id, model) {
        const roads = this.mongoService.Roads();
        const road = await roads.findByIdAndUpdate(id, model);
        common_1.Logger.log(`road-service => RoadService => edit: A road updated: ${JSON.stringify(road)}`);
        return road;
    }
    async remove(id) {
        const roads = this.mongoService.Roads();
        const road = await roads.findByIdAndDelete(id);
        common_1.Logger.log(`road-service => RoadService => remove: A road removed: ${JSON.stringify(road)}`);
        return road;
    }
};
exports.RoadService = RoadService;
exports.RoadService = RoadService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongo_service_1.MongoService !== "undefined" && mongo_service_1.MongoService) === "function" ? _a : Object, typeof (_b = typeof shared_1.RedisClient !== "undefined" && shared_1.RedisClient) === "function" ? _b : Object])
], RoadService);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongoService = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const mongoose_1 = __webpack_require__(8);
const mongodb_1 = __webpack_require__(13);
const mongoose_2 = __webpack_require__(14);
const schemas_1 = __webpack_require__(15);
let MongoService = class MongoService {
    constructor(configService, roadModel, eventModel, scheduleModel, patternModel) {
        this.configService = configService;
        this.roadModel = roadModel;
        this.eventModel = eventModel;
        this.scheduleModel = scheduleModel;
        this.patternModel = patternModel;
    }
    async onModuleInit() {
        const databaseUrl = this.configService.getOrThrow('DATABASE_URL');
        this.client = new mongodb_1.MongoClient(databaseUrl, {});
        await this.client.connect();
        const dbName = this.configService.get('DATABASE_NAME') ||
            this.getDatabaseNameFromUrl(databaseUrl);
        this.db = this.client.db(dbName);
    }
    async onModuleDestroy() {
        await this.client.close();
    }
    getDb() {
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
    getDatabaseNameFromUrl(url) {
        const parsed = new URL(url);
        const dbName = parsed.pathname.replace('/', '');
        if (!dbName) {
            throw new Error(`Can't get database name`);
        }
        return dbName;
    }
};
exports.MongoService = MongoService;
exports.MongoService = MongoService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(schemas_1.Road.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(Event.name)),
    tslib_1.__param(3, (0, mongoose_1.InjectModel)(schemas_1.Schedule.name)),
    tslib_1.__param(4, (0, mongoose_1.InjectModel)(schemas_1.Pattern.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], MongoService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(3);
tslib_1.__exportStar(__webpack_require__(16), exports);
tslib_1.__exportStar(__webpack_require__(17), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadSchema = exports.Road = void 0;
const tslib_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(8);
let Road = class Road {
};
exports.Road = Road;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, length: 50 }),
    tslib_1.__metadata("design:type", String)
], Road.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Road.prototype, "IsOpen", void 0);
exports.Road = Road = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Road);
exports.RoadSchema = mongoose_1.SchemaFactory.createForClass(Road);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const tslib_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(14);
const road_schema_1 = __webpack_require__(16);
const cause_schema_1 = __webpack_require__(18);
let Event = class Event {
};
exports.Event = Event;
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "Description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, type: cause_schema_1.CauseSchema }),
    tslib_1.__metadata("design:type", typeof (_a = typeof cause_schema_1.Cause !== "undefined" && cause_schema_1.Cause) === "function" ? _a : Object)
], Event.prototype, "Cause", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Road',
        required: true,
    }),
    tslib_1.__metadata("design:type", typeof (_b = typeof road_schema_1.Road !== "undefined" && road_schema_1.Road) === "function" ? _b : Object)
], Event.prototype, "Road", void 0);
exports.Event = Event = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CauseSchema = exports.Cause = void 0;
const tslib_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(8);
let Cause = class Cause {
};
exports.Cause = Cause;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Boolean)
], Cause.prototype, "block", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Boolean)
], Cause.prototype, "crowding", void 0);
exports.Cause = Cause = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Cause);
exports.CauseSchema = mongoose_1.SchemaFactory.createForClass(Cause);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatternSchema = exports.Pattern = void 0;
const tslib_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(14);
const road_schema_1 = __webpack_require__(16);
const cause_schema_1 = __webpack_require__(18);
let Pattern = class Pattern {
};
exports.Pattern = Pattern;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, length: 50 }),
    tslib_1.__metadata("design:type", String)
], Pattern.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Pattern.prototype, "IsActive", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Pattern.prototype, "Start", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", Number)
], Pattern.prototype, "End", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Pattern.prototype, "Description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, type: cause_schema_1.CauseSchema }),
    tslib_1.__metadata("design:type", typeof (_a = typeof cause_schema_1.Cause !== "undefined" && cause_schema_1.Cause) === "function" ? _a : Object)
], Pattern.prototype, "Cause", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Road',
        required: true,
    }),
    tslib_1.__metadata("design:type", typeof (_b = typeof road_schema_1.Road !== "undefined" && road_schema_1.Road) === "function" ? _b : Object)
], Pattern.prototype, "Road", void 0);
exports.Pattern = Pattern = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Pattern);
exports.PatternSchema = mongoose_1.SchemaFactory.createForClass(Pattern);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleSchema = exports.Schedule = void 0;
const tslib_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(14);
const road_schema_1 = __webpack_require__(16);
const cause_schema_1 = __webpack_require__(18);
let Schedule = class Schedule {
};
exports.Schedule = Schedule;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, length: 50 }),
    tslib_1.__metadata("design:type", String)
], Schedule.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Schedule.prototype, "IsActive", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Schedule.prototype, "Start", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Schedule.prototype, "End", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Schedule.prototype, "Description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, type: cause_schema_1.CauseSchema }),
    tslib_1.__metadata("design:type", typeof (_c = typeof cause_schema_1.Cause !== "undefined" && cause_schema_1.Cause) === "function" ? _c : Object)
], Schedule.prototype, "Cause", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Road',
        required: true,
    }),
    tslib_1.__metadata("design:type", typeof (_d = typeof road_schema_1.Road !== "undefined" && road_schema_1.Road) === "function" ? _d : Object)
], Schedule.prototype, "Road", void 0);
exports.Schedule = Schedule = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Schedule);
exports.ScheduleSchema = mongoose_1.SchemaFactory.createForClass(Schedule);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(3);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const redis_module_1 = __webpack_require__(23);
const auth_module_1 = __webpack_require__(27);
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            redis_module_1.RedisModule,
            auth_module_1.AuthModule
        ],
        exports: [redis_module_1.RedisModule],
    })
], SharedModule);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(24));
const config_1 = __webpack_require__(5);
const redis_client_1 = __webpack_require__(25);
const constants_1 = __webpack_require__(26);
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: constants_1.DI.REDIS_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return new ioredis_1.default({
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                        password: configService.get('REDIS_PASSWORD'),
                    });
                },
            },
            redis_client_1.RedisClient
        ],
        exports: [redis_client_1.RedisClient, constants_1.DI.REDIS_CLIENT],
    })
], RedisModule);


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisClient = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(24));
let RedisClient = class RedisClient {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.client = new ioredis_1.default({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
            password: this.configService.get('REDIS_PASSWORD'),
        });
        this.subscriber = this.client.duplicate();
        this.client.on('connect', () => common_1.Logger.log('Shared => RedisClient: Redis connected'));
        this.client.on('error', (err) => common_1.Logger.error('Shared => RedisClient: Redis Client Error', err));
        this.subscriber.on('connect', () => common_1.Logger.log('Shared => RedisClient: Redis subscriber connected'));
        this.subscriber.on('error', (err) => common_1.Logger.error('Shared => RedisClient: Redis Subscriber Error', err));
    }
    onModuleDestroy() {
        this.client.quit();
        this.subscriber.quit();
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
    async publish(channel, message) {
        await this.client.publish(channel, message);
    }
    async subscribe(channel, handler) {
        await this.subscriber.subscribe(channel);
        this.subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                handler(msg);
            }
        });
    }
};
exports.RedisClient = RedisClient;
exports.RedisClient = RedisClient = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RedisClient);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DI = void 0;
exports.DI = {
    REDIS_CLIENT: Symbol('REDIS_CLIENT')
};


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(3);
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const nest_keycloak_connect_1 = __webpack_require__(28);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nest_keycloak_connect_1.KeycloakConnectModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    authServerUrl: config.get('KC_URL'),
                    realm: config.get('KC_REALM'),
                    clientId: config.get('KC_CLIENT_ID'),
                    secret: config.get('KC_CLIENT_SECRET'),
                }),
            }),
        ],
        providers: [
            {
                provide: 'APP_GUARD',
                useClass: nest_keycloak_connect_1.AuthGuard,
            },
            {
                provide: 'APP_GUARD',
                useClass: nest_keycloak_connect_1.ResourceGuard,
            },
            {
                provide: 'APP_GUARD',
                useClass: nest_keycloak_connect_1.RoleGuard,
            },
        ],
        exports: [nest_keycloak_connect_1.KeycloakConnectModule],
    })
], AuthModule);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("nest-keycloak-connect");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REDIS = void 0;
exports.REDIS = {
    ROADS: {
        BASE: 'ROADS:*',
        COUNT: 'ROADS:COUNT',
        SINGLE: 'ROADS:DETAILS:_ID',
    },
};


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongoModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const mongo_service_1 = __webpack_require__(12);
const mongoose_1 = __webpack_require__(8);
const schemas_1 = __webpack_require__(15);
let MongoModule = class MongoModule {
};
exports.MongoModule = MongoModule;
exports.MongoModule = MongoModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: schemas_1.Road.name, schema: schemas_1.RoadSchema },
                { name: schemas_1.Event.name, schema: schemas_1.EventSchema },
                { name: schemas_1.Schedule.name, schema: schemas_1.ScheduleSchema },
                { name: schemas_1.Pattern.name, schema: schemas_1.PatternSchema },
            ]),
        ],
        providers: [mongo_service_1.MongoService],
        exports: [mongo_service_1.MongoService]
    })
], MongoModule);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const common_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(port, () => {
        common_1.Logger.log(`Application is running on: http://localhost:${port}`);
    });
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map