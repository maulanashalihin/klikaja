import { Request, Response } from "hyper-express";

export interface Link {
    id: string;
    user_id: string;
    alias: string;
    urls: Array<{ url: string; weight?: number }>;
    title?: string;
    is_active: boolean;
    click_count: number;
    created_at: number;
    updated_at: number;
}

export interface Response extends Response {
    view(view : string,data? : any) : void,
    inertia(view : string,data? : any) : void,
    flash(message : string, data : any) : Response,
}


export interface Request extends Request {
    user : any,
    share : any,
}
