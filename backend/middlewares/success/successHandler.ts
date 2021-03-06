import {Request, Response, NextFunction} from "express";
import {Logger} from "log4js";

import JSONResponse from "../../models/util/response/jsonGenericResponseModel";
import {ResponseCodes} from "../../models/util/response/responseCodes";

function handleFinalSuccess(req: Request, res: Response, next: NextFunction) {
    if (!req.routed) {
        next();
        return;
    }
    let response = req.returnObject;
    if (!response) {
        response = new JSONResponse(ResponseCodes.SUCCESS, "success");
    }
    const logger: Logger = req.app.get("logger");
    logger.info(req.method + " " + req.originalUrl + ": SUCCESS");
    res.json(response);
}

export default handleFinalSuccess;
