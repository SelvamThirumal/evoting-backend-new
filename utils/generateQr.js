const QRCode = require("qrcode");

module.exports = async(text)=>{
 return await QRCode.toDataURL(text);
};
