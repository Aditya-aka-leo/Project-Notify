const cron = require('node-cron');
const Relayer = require('../models/relayer');
const {Validator_Prioritizer_Prod} = require('../controller/controller');
const extract_from_db = async () => {
    try {
        console.log("Extracting from db");
        const data = await Relayer.find({});

        data.forEach(async (msg) => {
            try {
                await Validator_Prioritizer_Prod(msg);
                await Relayer.findByIdAndDelete(msg._id);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
    }
};

module.exports = () => {
    cron.schedule('*/30 * * * *', () => {
        console.log('Running cron job...');
        extract_from_db();
      });
}
