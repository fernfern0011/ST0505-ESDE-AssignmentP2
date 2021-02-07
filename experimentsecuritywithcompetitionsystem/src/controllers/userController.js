const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');

// 
exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    fileDataManager.uploadFile(file, async function (error, result) {
        console.log('check result variable in fileDataManager.upload code block\n', result);
        console.log('check error variable in fileDataManager.upload code block\n', error);
        let uploadResult = result;
        if (error) {
            var jsonResult = {
                success: false,
                message: 'Unable to complete file submission',
                error_code: 500,
                data: {}
            }

            res.status(500).json(jsonResult);
            res.end();
        } else {
            //Update the file table inside the MySQL when the file image
            //has been saved at the cloud storage (Cloudinary)
            let imageURL = uploadResult.imageURL;
            let publicId = uploadResult.publicId;
            console.log('check uploadResult before calling createFileData in try block', uploadResult);
            try {
                let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                console.log('Inspert result variable inside fileDataManager.uploadFile code');
                console.log(result);
                if (result) {
                    var jsonResult = {
                        success: true,
                        message: 'File submission completed',
                        data: {
                            imageURL: imageURL
                        }
                    }

                    return res.status(200).json(jsonResult);
                }
            } catch (error) {

                var jsonResult = {
                    success: false,
                    message: 'File submission failed.',
                    error_code: 500,
                    data: {}
                }

                res.status(500).json(jsonResult);
            }
        }
    })
}; //End of processDesignSubmission
exports.processGetSubmissionData = async (req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {

            var jsonResult = {
                success: true,
                message: 'Successfully retrieved submission data',
                data: [{
                    'number_of_records': results[0].length,
                    'page_number': pageNumber,
                    'filedata': results[0],
                    'total_number_of_records': results[2][0].total_records
                }]
            }

            return res.status(200).json(jsonResult);
        }
    } catch (error) {

        var jsonResult = {
            success: false,
            message: 'Server is unable to process your request',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }

}; //End of processGetSubmissionData
exports.processGetUserData = async (req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    try {
        let results = await userManager.getUserData(pageNumber, search);
        console.log('Inspect result variable inside processGetUserData code\n', results);
        if (results) {

            var jsonResult = {
                success: true,
                message: 'Successfully retrieved user data',
                data: [{
                    'number_of_records': results[0].length,
                    'page_number': pageNumber,
                    'userdata': results[0],
                    'total_number_of_records': results[2][0].total_records
                }]
            }

            return res.status(200).json(jsonResult);
        }
    } catch (error) {

        var jsonResult = {
            success: false,
            message: 'Server is unable to process your request',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }

}; //End of processGetUserData

exports.processGetOneUserData = async (req, res, next) => {
    let recordId = req.params.recordId;

    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {

            var jsonResult = {
                success: true,
                message: 'Successfully retrieved one user data',
                data: results[0]
            }

            return res.status(200).json(jsonResult);
        }
    } catch (error) {

        var jsonResult = {
            success: false,
            message: 'Server is unable to process your request',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }

}; //End of processGetOneUserData


exports.processUpdateOneUser = async (req, res, next) => {
    console.log('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);
        insertId = results.insertId;

        var jsonResult = {
            success: true,
            message: 'Completed update',
            data: { insertId }
        }

        return res.status(200).json(jsonResult);
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');

        var jsonResult = {
            success: false,
            message: 'Unable to complete update operation',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }


}; //End of processUpdateOneUser

exports.processGetOneDesignData = async (req, res, next) => {
    let recordId = req.params.fileId;

    try {
        let results = await userManager.getOneDesignData(recordId);
        console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results) {

            var jsonResult = {
                success: true,
                message: 'Successfully retrieved one design data',
                data: results[0]
            }

            return res.status(200).json(jsonResult);
        }
    } catch (error) {

        var jsonResult = {
            success: false,
            message: 'Server is unable to process the request',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }

}; //End of processGetOneDesignData

exports.processUpdateOneDesign = async (req, res, next) => {
    console.log('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription);
        console.log(results);
        insertId = results.insertId;

        var jsonResult = {
            success: true,
            message: 'Completed update',
            data: insertId
        }

        return res.status(200).json(jsonResult);
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');

        var jsonResult = {
            success: false,
            message: 'Unable to complete update operation',
            error_code: 500,
            data: {}
        }

        return res.status(500).json(jsonResult);
    }
}; //End of processUpdateOneDesign