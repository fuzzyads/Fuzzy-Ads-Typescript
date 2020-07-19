"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var hub_1 = require("@textile/hub");
var body_parser_1 = __importDefault(require("body-parser"));
var _a = require('./config'), API_KEY = _a.API_KEY, API_SECRET = _a.API_SECRET, DB_ID = _a.DB_ID;
var app = express_1["default"]();
app.use(body_parser_1["default"].json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', ['GET', 'POST']);
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
var threadId = hub_1.ThreadID.fromString(DB_ID);
function getClient() {
    return __awaiter(this, void 0, void 0, function () {
        var keyInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyInfo = {
                        key: API_KEY,
                        secret: API_SECRET
                    };
                    return [4 /*yield*/, hub_1.Client.withKeyInfo(keyInfo)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// ______________ROUTES________________
app.get('/api/users/:publicKey', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var publicKey, client, exists, _a, newPublisher;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                publicKey = req.params.publicKey;
                return [4 /*yield*/, getClient()];
            case 1:
                client = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, client.findByID(threadId, "Publishers", publicKey)];
            case 3:
                exists = _b.sent();
                res.send(exists.instance);
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                newPublisher = {
                    _id: publicKey,
                    nonce: Math.floor(Math.random() * 10000),
                    website: ""
                };
                client.create(threadId, "Publishers", [newPublisher]);
                res.send(newPublisher);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/api/auth', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // const { _id, signature } = req.body;
        console.log(req.body);
        res.send(req.body);
        return [2 /*return*/];
    });
}); });
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("listening on port " + PORT);
});
