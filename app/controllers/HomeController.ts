import { view } from "app/services/View";
import { Response, Request } from "../../type"; 
import fs from "fs";
import path from "path";

class Controller {
    
    public async index (request : Request,response : Response) { 
        return response.inertia("Home/Index");
    }



    // SEO-friendly static pages
    public async about (request : Request, response : Response) {
        return response.send(view("about.html"));
    }

    public async features (request : Request, response : Response) {
        return response.send(view("features.html"));
    }

    public async pricing (request : Request, response : Response) {
        return response.send(view("pricing.html"));
    }

    public async privacy (request : Request, response : Response) {
        return response.send(view("privacy.html"));
    }

    public async terms (request : Request, response : Response) {
        return response.send(view("terms.html"));
    }

    public async contact (request : Request, response : Response) {
        return response.send(view("contact.html"));
    }
}

export default new Controller()

 