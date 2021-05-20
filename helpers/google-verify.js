const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const googleVerify = async ( token )=> {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,  // Specify the GOOGLE_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[GOOGLE_ID_1, GOOGLE_ID_2, GOOGLE_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return {name,email,picture};
}

module.exports = {
    googleVerify
}