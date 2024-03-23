
import { error } from '@sveltejs/kit';
import {Message, getSSLHubRpcClient} from "@farcaster/hub-nodejs";
import { PUBLIC_BASE_URL } from '$env/static/public';

import render from './gameloop.js';

const HUB_URL = PUBLIC_BASE_URL;
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;


function getHtml(frameImage) {
  const framePostUrl = HUB_URL+"/api";
  
const str  = `
<html lang="en">
          <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${frameImage}" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:post_url" content="${framePostUrl}?r=3" />
          <meta property="fc:frame:button:1" content="⬆️" />
          <meta property="fc:frame:button:2" content="⬇️" />
          <meta property="fc:frame:button:3" content="⬅️" />
          <meta property="fc:frame:button:4" content="➡️" />
            <title>Farcaster Frames</title>
          </head>
        </html>`

        return str;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {

  const data = await parseData(await request.json());
 
  console.log(data)
  //console.log(JSON.stringify(await request.json(), null, 2));
	const image = await render(data.fid, data.buttonId);

	return new Response(String(getHtml(image, url.host)));
}


async function parseData(req) {

        const reqData =req;
      console.log({reqData})

        // Process the vote
        // For example, let's assume you receive an option in the body
        try {
            let frameMessage;
            
            let validatedMessage = undefined;
            try {
                frameMessage = Message.decode(Buffer.from(reqData.trustedData?.messageBytes || '', 'hex'));
                const result = await client?.validateMessage(frameMessage);
                if (result && result.isOk() && result.value.valid) {
                  validatedMessage = result.value.message;
                }

                // Also validate the frame url matches the expected url
                //let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
                //const urlString = Buffer.from(urlBuffer).toString('utf-8');
                //console.log("urlString", urlString)
                //if (validatedMessage && !urlString.startsWith(process.env['HOST'] || '')) {
                //return;
                    //return res.status(400).send(`Invalid frame url: ${urlBuffer}`);
                //}
            } catch (e)  {
                console.error("eerr",e);
                return;
                //return res.status(400).send(`Failed to validate message: ${e}`);
            }

            let buttonId = 0, fid = 0;
            // If HUB_URL is not provided, don't validate and fall back to untrusted data
            if (client) {
                buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
                fid = validatedMessage?.data?.fid || 0;
            } else {
              buttonId = req.untrustedData?.buttonIndex || 0;
              fid = req.untrustedData?.fid || 0;
            }
            if(!buttonId && !fid){
              buttonId = frameMessage.data?.frameActionBody?.buttonIndex || buttonId;
              fid = frameMessage.data?.frameActionBody?.fid || fid; 
            }

            if(!fid) {
              fid = req.untrustedData?.fid;
              buttonId = req.untrustedData?.buttonIndex || buttonId;
            }

              
            //}
            return { buttonId, fid };
          
        } catch (e) {
          console.error("err", e);
          return;
        }
      }
