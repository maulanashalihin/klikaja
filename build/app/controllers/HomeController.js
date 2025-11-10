"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../services/View");
class Controller {
    async index(request, response) {
        return response.inertia("Home/Index");
    }
    async about(request, response) {
        return response.send((0, View_1.view)("about.html"));
    }
    async features(request, response) {
        return response.send((0, View_1.view)("features.html"));
    }
    async pricing(request, response) {
        return response.send((0, View_1.view)("pricing.html"));
    }
    async privacy(request, response) {
        return response.send((0, View_1.view)("privacy.html"));
    }
    async terms(request, response) {
        return response.send((0, View_1.view)("terms.html"));
    }
    async contact(request, response) {
        return response.send((0, View_1.view)("contact.html"));
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map