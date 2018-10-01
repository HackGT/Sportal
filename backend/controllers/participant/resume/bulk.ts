import {Router} from "express";
import {S3} from "aws-sdk";
import {tmpNameSync} from "tmp";
import * as archiver from "archiver";

import {ResponseCodes} from "../../../models/util/response/responseCodes";

interface IGetBulkResumeRequest {
    resumes: string[];
}

const router = Router();

router.post("/", async (req, res, next) => {
    const resumeBulkRequest = req.body as IGetBulkResumeRequest;
    if (!resumeBulkRequest || !resumeBulkRequest.resumes) {
        res.status(ResponseCodes.ERROR_BAD_REQUEST)
        next(new Error("Request missing resume list parameter"));
        return;
    }
    try {
        const s3 = new S3();
        const tempZipFileNameSplit = tmpNameSync({prefix: "resumes-bulk-", postfix: ".zip"}).split("\\");
        const tempZipFileName = tempZipFileNameSplit[tempZipFileNameSplit.length - 1];
        const archive = archiver("zip", {zlib: {level: req.app.get("config").zlibCompressionLevel}});
        res.status(ResponseCodes.SUCCESS);
        res.header("Content-type", "application/octet-stream");
        res.header("Content-Disposition", "attachment; filename=\"" + tempZipFileName + "\"");
        archive.pipe(res);
        resumeBulkRequest.resumes.forEach(resume => {
            const awsParams = {Bucket: req.app.get("config").awsResumeBucket as string, Key: resume};
            const arr = resume.split("/");
            const fileName = arr[arr.length - 1];
            const resumeObject = s3.getObject(awsParams).createReadStream();
            archive.append(resumeObject, {name: fileName});
        });
        archive.finalize();
    } catch (err) {
        next(err)
    }
});

export default router;