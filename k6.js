import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    Download_Test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 400 },
        { duration: '2m', target: 500 },
        { duration: '5m', target: 700 },
        { duration: '2m', target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000'],
  },
};
const TOKEN_URL =
'https://login.oat.brightmine.com/oauth/token';

const DOWNLOAD_URL =
'https://datamanager.us.oat.brightmine.com/api/v1/Dataset/Download/';

export default function () {

    // -------------------------
    //   Step 1 : Get Access Token
    // -------------------------

    const tokenPayload = {
        client_id: 'huPCpEdc5R1H1aDJzD5HiADO1jdR1r9',
        code_verifier: 'DIGqU0fC5o9~qOG8Vfue7aJZx8YLpXbR0hSWbxuAKym',
        grant_type: 'authorization_code',
        code: '5QRS8adnQ8mt68rrXuVl1VwcP7jRtsWSX7rpXS9',
        redirect_uri:'https://datamanager.us.oat.brightmine.com/auth/post-sso'
     };

    const tokenHeaders = {
        headers: {
            'Content-Type':
                'application/x-www-form-urlencoded'
        }
    };

    const tokenRes = http.post(
        TOKEN_URL,
        tokenPayload,
        tokenHeaders
    );

    check(tokenRes, {
        'Token API 200': r => r.status === 200,
    });

    const accessToken =
        tokenRes.json('access_token');

    // -------------------------
    // Step 2 : Download API
    // -------------------------

    const downloadPayload = JSON.stringify({

        Id: "facd82fa-50c9-41ed-8a96-7fbb8cc2d637",

        ModifiedById:
        "3935b45f-bbfa-41f2-8081-375b1e41a1a7",

        ModifiedByName:
        "pentestussb",

        ModuleId: "2",

        SalesforceRefNumber:
        "Internal Users"

    });

    const downloadHeaders = {
        headers: {

            Authorization:
                `Bearer ${accessToken}`,

            'Content-Type':
                'application/json',

            Accept: 'application/json'
        }
    };

    const downloadRes = http.post(
        DOWNLOAD_URL,
        downloadPayload,
        downloadHeaders
    );

    check(downloadRes, {

        'Download API 200':
            r => r.status === 200,

        'File returned':
            r => r.body.length > 0,

    });

    console.log(
        `Status : ${downloadRes.status}`
    );


    sleep(1);

}
