const previousStockState = {};

/**
 * Determine whether a SKU transitioned from out-of-stock to in-stock.
 * This function also updates the stored previous state for the SKU.
 *
 * @param {string} sku - SKU identifier to check.
 * @param {boolean} currentAvailability - true if currently in stock.
 * @returns {boolean} true if the SKU changed from not-available to available.
 */
const statusChanged = (sku, currentAvailability) => {
    const previousAvailability = previousStockState[sku] === true;
    const changed = !previousAvailability && currentAvailability;

    //Update previous stock state for next check
    previousStockState[sku] = currentAvailability;

    return changed;
};

module.exports = {
    statusChanged
};
