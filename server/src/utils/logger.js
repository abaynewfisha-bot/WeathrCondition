function info(message, details = "") {
  console.log(`[INFO] ${new Date().toISOString()} ${message}`, details);
}

function error(message, details = "") {
  console.error(`[ERROR] ${new Date().toISOString()} ${message}`, details);
}

module.exports = { info, error };
