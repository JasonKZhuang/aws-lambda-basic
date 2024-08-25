const https = require('https');

const fetchPostData = () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject('Error parsing JSON from API 1');
                }
            });
        }).on('error', (error) => {
            reject(`Error with the request to API 1: ${error.message}`);
        });
    });
};

const fetchUserData = () => {
    const url = 'https://jsonplaceholder.typicode.com/users';

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject('Error parsing JSON from API 2');
                }
            });
        }).on('error', (error) => {
            reject(`Error with the request to API 2: ${error.message}`);
        });
    });
};

exports.handler = async (event, context) => {
    console.log("EVENT:\n" + JSON.stringify(event, null, 2))
    console.log("CONTEXT:\n" + JSON.stringify(context, null, 2))
    console.log("Start Time ==================: " + new Date())
    let startTime = 0;
    let endTime = 0;
    let diffTime = 0;
    try {
        startTime = new Date().getTime
        const [postData, userData] = await Promise.all([
            fetchPostData(),
            fetchUserData()
        ]);
        endTime = new Date().getTime();
        diffTime = endTime - startTime;

        console.log("End Time ==================: " + new Date())
        console.log("Diff milli seconds ==================: " + diffTime)

        console.log("Post Data ==================: " + JSON.stringify(postData[0]))
        console.log("User Data ==================: " + JSON.stringify(userData[0]))

        return {
            statusCode: 200,
            startTime: startTime,
            endTime:  endTime,
            diffTime: diffTime,
            postData: postData,
            userData: userData,
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error}),
        };
    }

};

