"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    async index(request, response) {
        return response.inertia("Home/Index");
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map