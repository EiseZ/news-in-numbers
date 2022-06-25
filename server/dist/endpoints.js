"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndpoints = void 0;
function createEndpoints(app) {
    app.get("/", (_, res) => {
        return res.send("News In Numbers API");
    });
}
exports.createEndpoints = createEndpoints;
//# sourceMappingURL=endpoints.js.map