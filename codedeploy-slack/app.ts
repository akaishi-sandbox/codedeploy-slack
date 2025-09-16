import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_TOKEN;
const debug_channel = process.env.SLACK_DEBUG_CHANNEL ?? "debug-channel";

const web = new WebClient(token);

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler = async (event:any) => {
  try {
    let text = null;
    (event.Records || []).forEach((rec:any) => {
      if (rec.Sns) {
        const message = JSON.parse(rec.Sns.Message);
        text = `*Application:${message.applicationName} deploymentGroupName: ${message.deploymentGroupName} deploymentId: ${message.deploymentId}* ${message.deploymentId}`;
      }
    });
    if (text !== null) {
      await web.chat.postMessage({
        channel: debug_channel,
        text: text
      });
    }
    // const ret = await axios(url);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world"
        // location: ret.data.trim()
      })
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
