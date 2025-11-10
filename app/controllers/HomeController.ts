import { Response, Request } from "../../type"; 
import fs from "fs";
import path from "path";

class Controller {
    
    public async index (request : Request,response : Response) { 
        return response.inertia("Home/Index");
    }

    // Helper method to serve HTML files
    private async serveHtml(filename: string, response: Response) {
        try {
            const filePath = path.join(process.cwd(), "resources", "views", `${filename}.html`);
            const html = await fs.promises.readFile(filePath, "utf-8");
            response.setHeader("Content-Type", "text/html");
            return response.send(html);
        } catch (error) {
            console.error(`Error serving ${filename}:`, error);
            return response.status(404).send("Page not found");
        }
    }

    // SEO-friendly static pages
    public async about (request : Request, response : Response) {
        return this.serveHtml("about", response);
    }

    public async features (request : Request, response : Response) {
        return this.serveHtml("features", response);
    }

    public async pricing (request : Request, response : Response) {
        return this.serveHtml("pricing", response);
    }

    public async privacy (request : Request, response : Response) {
        return this.serveHtml("privacy", response);
    }

    public async terms (request : Request, response : Response) {
        return this.serveHtml("terms", response);
    }

    public async contact (request : Request, response : Response) {
        return this.serveHtml("contact", response);
    }
}

export default new Controller()
