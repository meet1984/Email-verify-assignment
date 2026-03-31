const { SMTPClient } = require("smtp-client");

async function checkSMTP(mx, email) {
  const client = new SMTPClient({
    host: mx,
    port: 25,
    timeout: 5000
  });
  try{
    await client.connect();

    await client.greet({ hostname: "localhost" });
    
    await client.mail({ from: "test@example.com" });

    const rcpt = await client.rcpt({ to: email });

    await client.quit();

    return {
        sucess : true,
        code: rcpt.code
    };
  }
 catch (error) {
  return {
    success: false,
    error: error.message || "SMTP connection failed"
  };
}
}

module.exports = { checkSMTP };