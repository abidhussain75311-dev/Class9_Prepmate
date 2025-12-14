const mongoose = require('mongoose');

const AdminConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g. 'admin_passcode'
    value: String
});

module.exports = mongoose.model('AdminConfig', AdminConfigSchema);
