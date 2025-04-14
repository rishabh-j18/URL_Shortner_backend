const useragent = require("useragent");

const parseUserAgent = (userAgentString) => {
  const agent = useragent.parse(userAgentString);
  return {
    browser: agent.toAgent(),
    os: agent.os.toString(),
    device: agent.device.toString(),
  };
};

module.exports = parseUserAgent;
