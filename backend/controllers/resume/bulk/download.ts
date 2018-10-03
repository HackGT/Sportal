import {Router} from "express";
import {join} from "path";

import {ResponseCodes} from "../../../models/util/response/responseCodes";
import {ZipState} from "../../../models/util/global/zipStateModel";

interface IBulkDownloadRequest {
    downloadId: string
    authToken: string
}

export const router = Router();

router.get("/", (req, res, next) => {
    const request = req.params as IBulkDownloadRequest;
    if (!request || !request.downloadId || !request.authToken) {
        req.routed = true;
        res.status(ResponseCodes.ERROR_BAD_REQUEST);
        next(new Error("Request missing parameters"));
        return;
    }
    const zipState = (req.app.post("zipState") as any)[request.downloadId] as ZipState;
    if (request.authToken !== zipState.authToken) {
        req.routed = true;
        res.status(ResponseCodes.ERROR_UNAUTHORIZED);
        next(new Error("You cannot access this zip file!"));
        return;
    }
    res.status(ResponseCodes.SUCCESS);
    res.download(join(process.cwd(), req.app.get("config").zipDirectory, "/resumes-bulk-" + request.downloadId + ".zip"));
    req.routed = true;
});

export default router;
