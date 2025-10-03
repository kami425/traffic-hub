/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const shared_1 = __webpack_require__(7);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true }), shared_1.SharedModule],
    })
], AppModule);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(8), exports);
tslib_1.__exportStar(__webpack_require__(9), exports);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(15), exports);
tslib_1.__exportStar(__webpack_require__(14), exports);
tslib_1.__exportStar(__webpack_require__(12), exports);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const redis_module_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(13);
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
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(10));
const config_1 = __webpack_require__(4);
const redis_client_1 = __webpack_require__(11);
const constants_1 = __webpack_require__(12);
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
/* 10 */
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisClient = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(10));
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
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DI = void 0;
exports.DI = {
    REDIS_CLIENT: Symbol('REDIS_CLIENT')
};


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const nest_keycloak_connect_1 = __webpack_require__(14);
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
/* 14 */
/***/ ((module) => {

module.exports = require("nest-keycloak-connect");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.proxyConfiguration = proxyConfiguration;
const http_proxy_middleware_1 = __webpack_require__(17);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const safeJSONParse = (input) => {
    if (!input) {
        return null;
    }
    try {
        return JSON.parse(input);
    }
    catch (e) {
        return input;
    }
};
const proxyResCallback = async (proxyRes, req, res) => {
    let body = '';
    proxyRes.on('data', (chunk) => {
        body += chunk;
    });
    proxyRes.on('end', () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            let statusCode = proxyRes.statusCode;
            const data = safeJSONParse(body);
            // Change default shape of error object of NestJS  to project default shape
            if (data.status && data.response && data.message && data.name) {
                statusCode = data.status;
            }
            const successFlag = statusCode >= 200 && statusCode < 300;
            const response = {
                success: successFlag,
                data: successFlag ? data : null,
                message: successFlag ? null : data?.message || 'Unexpected error',
            };
            res.status(statusCode).json(response);
        }
        catch (err) {
            common_1.Logger.error(err);
            res.status(500).json({
                success: false,
                data: null,
                message: 'Invalid response from service',
            });
        }
    });
};
function proxyConfiguration(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app, globalPrefix) {
    const configService = app.get(config_1.ConfigService);
    const userServiceUrl = configService.get('USER_SERVICE_URL');
    const roadwayServiceUrl = configService.get('ROADWAY_SERVICE_URL');
    app.use(`/${globalPrefix}/user`, (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: userServiceUrl,
        changeOrigin: true,
        pathRewrite: { [`^/${globalPrefix}/user`]: '' },
        selfHandleResponse: true,
        onProxyRes: proxyResCallback,
    }));
    app.use(`/${globalPrefix}/roadway`, (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: roadwayServiceUrl,
        changeOrigin: true,
        pathRewrite: { [`^/${globalPrefix}/roadway`]: '' },
        selfHandleResponse: true,
        onProxyRes: proxyResCallback,
    }));
}


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("http-proxy-middleware");

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
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const helmet_1 = tslib_1.__importDefault(__webpack_require__(5));
const app_module_1 = __webpack_require__(6);
const proxy_config_1 = __webpack_require__(16);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const port = configService.get('PORT');
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    (0, proxy_config_1.proxyConfiguration)(app, globalPrefix);
    app.use((0, helmet_1.default)());
    await app.listen(port, () => {
        common_1.Logger.log(`Gateway is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map