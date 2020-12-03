const utils =
{
    /**
     * Parse request into sequelize query params and options
     * @param {Object} req 
     */
    parseOptionsReq(req) {
        const { query } = req;
        const where = {};
        Object.entries(query.c || {}).forEach(([fieldName, value]) => {
            if (!value.startsWith('{')) {
                where[fieldName] = value === 'null' ? null : value;
                return;
            }
            let criteria;
            try {
                criteria = JSON.parse(value);
            }
            catch (error) {
                where[fieldName] = value;
                return;
            }
            where[fieldName] = {};
            Object.entries(criteria).forEach(([op, options]) => {
                if (!module.exports.operatorCheck(op)) {
                    throw new AdnocError(`bad operator ${op}`);
                }
                where[fieldName][Op[op]] = options;
            });
        });
        const options = {
            where,
        };
        if (typeof query.order === 'string') {
            options.order = query.order.split(',').map(i => (i.startsWith('-') ? [i.substr(1), 'DESC'] : i));
        }
        const limit = parseInt(query.limit, 10);
        if (!Number.isNaN(limit)) {
            options.limit = limit;
        }
        const offset = parseInt(query.offset, 10);
        if (!Number.isNaN(offset)) {
            options.offset = offset;
        }
        return options;
    }
};
module.exports = utils;