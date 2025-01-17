const fs = require("fs");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid"); // For generating unique file names

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, // Add these in your .env file
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION, // Example: "us-east-1"
});

const s3 = new AWS.S3();

// Function to generate pre-signed URL
const getPreSignedUrl = (fileKey) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME || "my-private-uk-bucket",
            Key: fileKey,
            Expires: 10, // URL expiration time in seconds (1 hour)
        };

        s3.getSignedUrl("getObject", params, (err, preSignedUrl) => {
            if (err) {
                console.error("Error generating pre-signed URL:", err);
                reject(err);
            } else {
                resolve(preSignedUrl); // Return the pre-signed URL
            }
        });
    });
};

// Function to upload file to S3 and generate pre-signed URL
const uploadToS3 = async (file, className, courseName,title,teacher,onProgress) => {
    try {
        // Create a structured key using className and courseName
        const fileKey = `resources/${className}/${courseName}/${title}/${teacher}/${uuidv4()}-${file.originalname.replace(/\s+/g, "_")}`;
        const fileContent = file.buffer || fs.readFileSync(file.path);

        const params = {
            Bucket: process.env.S3_BUCKET_NAME || "my-private-uk-bucket",
            Key: fileKey,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: "private",
        };

        return new Promise((resolve, reject) => {
            const upload = s3.upload(params);

            // Attach progress event listener
            upload.on("httpUploadProgress", (progress) => {
                const percentage = Math.round((progress.loaded / progress.total) * 100);
                if (onProgress) onProgress(percentage);
            });

            // Start upload
            upload.send(async (err, data) => {
                if (err) {
                    console.error("Error uploading to S3:", err);
                    reject(err);
                } else {
                    const preSignedUrl = await getPreSignedUrl(fileKey);
                    resolve({
                        key: fileKey,
                        url: data.Location,
                        preSignedUrl,
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error in S3 upload function:", error.message);
        throw new Error("File upload failed.");
    }
};


module.exports = {
    getPreSignedUrl,
    uploadToS3
};
